#!/usr/bin/env node
/**
 * Scans RSS feeds and updates public/milestones-status.json
 * Run via GitHub Actions on a schedule.
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const RULES_PATH = join(__dirname, 'milestone-rules.json');
const OUTPUT_PATH = join(ROOT, 'public', 'milestones-status.json');

const STATUS_RANK = {
  'non-iniziato': 0,
  'in-corso': 1,
  'ritardato': 2,
  'raggiunto': 3,
};

function extractTag(block, tag) {
  const cdata = new RegExp(`<${tag}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`, 'i');
  const cdataMatch = block.match(cdata);
  if (cdataMatch) return cdataMatch[1].trim();

  const plain = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, 'i');
  const plainMatch = block.match(plain);
  return plainMatch ? plainMatch[1].trim().replace(/<[^>]+>/g, '') : '';
}

function parseRssItems(xml) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];
    const title = extractTag(block, 'title');
    const link = extractTag(block, 'link');
    const pubDate = extractTag(block, 'pubDate');
    const description = extractTag(block, 'description');
    if (title) {
      items.push({
        title,
        link: link || '',
        pubDate: pubDate || '',
        description: description || '',
        text: `${title} ${description}`.toLowerCase(),
      });
    }
  }
  return items;
}

async function fetchFeed(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'SPCX-Milestone-Tracker/1.0' },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`Feed ${url}: HTTP ${res.status}`);
  const xml = await res.text();
  return parseRssItems(xml);
}

function itemAgeDays(pubDate) {
  if (!pubDate) return 999;
  const d = new Date(pubDate);
  if (Number.isNaN(d.getTime())) return 999;
  return (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24);
}

function maxAgeForStatus(status) {
  if (status === 'raggiunto' || status === 'ritardato') return 180;
  return 365;
}

function detectStatus(milestoneRules, items) {
  let best = null;

  for (const rule of milestoneRules.rules) {
    for (const keyword of rule.keywords) {
      const kw = keyword.toLowerCase();
      const hit = items.find(
        (item) =>
          item.text.includes(kw) &&
          itemAgeDays(item.pubDate) <= maxAgeForStatus(rule.status)
      );
      if (hit) {
        const candidate = {
          status: rule.status,
          confidence: rule.status === 'raggiunto' ? 'high' : 'medium',
          evidence: hit.title,
          evidenceUrl: hit.link,
          detectedAt: new Date().toISOString(),
          matchedKeyword: keyword,
          pubDate: hit.pubDate,
        };
        if (
          !best ||
          STATUS_RANK[candidate.status] > STATUS_RANK[best.status]
        ) {
          best = candidate;
        }
      }
    }
  }

  return best;
}

async function main() {
  const rules = JSON.parse(readFileSync(RULES_PATH, 'utf8'));
  let existing = { version: 1, updates: {}, recentNews: [] };
  if (existsSync(OUTPUT_PATH)) {
    existing = JSON.parse(readFileSync(OUTPUT_PATH, 'utf8'));
  }

  const allItems = [];
  const feedErrors = [];

  for (const feedUrl of rules.feeds) {
    try {
      const items = await fetchFeed(feedUrl);
      allItems.push(...items);
    } catch (err) {
      feedErrors.push({ feed: feedUrl, error: String(err.message || err) });
      console.warn(`Feed error: ${feedUrl}`, err.message);
    }
  }

  const uniqueItems = [];
  const seen = new Set();
  for (const item of allItems) {
    const key = item.title.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      uniqueItems.push(item);
    }
  }

  const updates = { ...existing.updates };
  const recentNews = [];

  for (const milestone of rules.milestones) {
    const detected = detectStatus(milestone, uniqueItems);
    if (detected) {
      updates[milestone.id] = detected;
      recentNews.push({
        title: detected.evidence,
        url: detected.evidenceUrl,
        milestoneId: milestone.id,
        date: detected.pubDate || detected.detectedAt.split('T')[0],
        source: 'Auto-monitor RSS',
      });
    } else if (!updates[milestone.id]) {
      updates[milestone.id] = {
        status: 'non-iniziato',
        confidence: 'low',
        evidence: null,
        evidenceUrl: null,
        detectedAt: new Date().toISOString(),
        matchedKeyword: null,
      };
    }
  }

  const output = {
    version: 1,
    lastChecked: new Date().toISOString(),
    feedCount: uniqueItems.length,
    feedErrors,
    updates,
    recentNews: recentNews.slice(0, 20),
  };

  const prevJson = JSON.stringify(existing, null, 2);
  const nextJson = JSON.stringify(output, null, 2);
  const changed = prevJson !== nextJson;

  writeFileSync(OUTPUT_PATH, nextJson + '\n');
  console.log(`Checked ${uniqueItems.length} items across ${rules.feeds.length} feeds`);
  console.log(`Detected updates for ${Object.keys(updates).length} milestones`);
  console.log(`Changed: ${changed}`);

  if (process.env.GITHUB_OUTPUT) {
    const { appendFileSync } = await import('fs');
    appendFileSync(process.env.GITHUB_OUTPUT, `changed=${changed}\n`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Milestone } from '../types';
import { STATUS_LABELS, SECTIONS } from '../types';

function getSectionName(sectionId: string): string {
  return SECTIONS.find((s) => s.id === sectionId)?.name ?? sectionId;
}

export function exportToCSV(milestones: Milestone[]): void {
  const headers = [
    'Sezione',
    'Milestone',
    'Descrizione',
    'Periodo Atteso',
    'Stato',
    'Ultimo Aggiornamento',
    'Fonte',
    'Note Personali',
  ];

  const rows = milestones.map((m) => [
    getSectionName(m.sectionId),
    m.name,
    m.description,
    m.expectedPeriod,
    STATUS_LABELS[m.status],
    m.lastUpdated,
    m.source,
    m.personalNotes,
  ]);

  const csvContent = [headers, ...rows]
    .map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    )
    .join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `spcx-milestones-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export function exportToPDF(milestones: Milestone[]): void {
  const doc = new jsPDF({ orientation: 'landscape' });
  const date = new Date().toLocaleDateString('it-IT');

  doc.setFontSize(18);
  doc.setTextColor(15, 21, 32);
  doc.text('SpaceX Milestone Tracker — SPCX', 14, 18);

  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(`Esportato il ${date} | Investitori di lungo termine`, 14, 26);

  const tableData = milestones.map((m) => [
    getSectionName(m.sectionId),
    m.name,
    m.expectedPeriod,
    STATUS_LABELS[m.status],
    m.lastUpdated,
    m.source,
  ]);

  autoTable(doc, {
    startY: 32,
    head: [['Sezione', 'Milestone', 'Periodo', 'Stato', 'Aggiornamento', 'Fonte']],
    body: tableData,
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [15, 21, 32], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [241, 245, 249] },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 70 },
      2: { cellWidth: 22 },
      3: { cellWidth: 22 },
      4: { cellWidth: 25 },
      5: { cellWidth: 40 },
    },
  });

  doc.save(`spcx-milestones-${new Date().toISOString().split('T')[0]}.pdf`);
}
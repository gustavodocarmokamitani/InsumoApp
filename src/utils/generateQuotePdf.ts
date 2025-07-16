import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Insumo } from "../interfaces/Insumo";

interface Selecionado extends Insumo {
  quantidade: number;
}

interface ClientInfo {
  name: string;
  company: string;
  brandIdentity: string;
  email: string;
}

interface PdfData {
  selecionados: Selecionado[];
  clientInfo: ClientInfo;
}

export const generateQuotePdf = ({ selecionados, clientInfo }: PdfData) => {
  const doc = new jsPDF();

  // Dados fixos da empresa (você pode passá-los como parâmetro também, se quiser que sejam dinâmicos)
  const companyLocation = "R.Noburo Nonaka, Santa Lídia \nGuarulhos - SP";
  const companyWebsite = "gustavodocarmokamitani.com.br";
  const companyEmail = "gustavodocarmokamitani@gmail.com";

  const quoteDate = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }); // Formato DD/MM/AAAA
  const dueDate = new Date(
    Date.now() + 10 * 24 * 60 * 60 * 1000
  ).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }); // Formato DD/MM/AAAA

  // Header - "ORÇAMENTO"
  doc.setFontSize(22);
  doc.text("Lista de Materiais", 14, 20); // Alinhado à esquerda

  // Company Location, Website, Email
  doc.setFontSize(10);
  doc.text(companyLocation, 14, 35); // Alinhado à esquerda
  doc.text(companyWebsite, 14, 45); // Alinhado à esquerda
  doc.text(companyEmail, 14, 50); // Alinhado à esquerda

  // Quote Dated and Due Date (Alinhados à direita como na imagem)
  doc.setFontSize(10);
  doc.text(`Orçamento Datado: ${quoteDate}`, 196, 45, { align: "right" });
  doc.text(`Data de Vencimento: ${dueDate}`, 196, 50, { align: "right" });

  // Divider Line
  doc.setLineWidth(0.5);
  doc.line(14, 55, 196, 55);

  let currentY = 65; // Starting Y position for client details

  // Client Details - Only add if inputs are not empty (left column)
  doc.setFontSize(10);
  const startYClientInfoLeft = currentY; // Store initial Y for left column

  if (clientInfo.name) {
    doc.text("Nome do Cliente:", 14, currentY);
    doc.text(clientInfo.name, 14, currentY + 5);
    currentY += 10;
  }
  if (clientInfo.company) {
    doc.text("Nome da Empresa:", 14, currentY);
    doc.text(clientInfo.company, 14, currentY + 5);
    currentY += 10;
  }
  if (clientInfo.brandIdentity) {
    doc.text("Identidade da Marca:", 14, currentY);
    doc.text(clientInfo.brandIdentity, 14, currentY + 5);
    currentY += 10;
  }

  // Client Email (Right column) - Start at the same Y as left column if left column is not empty
  let rightColumnY = startYClientInfoLeft;
  if (clientInfo.email) {
    doc.text("Email do Cliente:", 140, rightColumnY);
    doc.text(clientInfo.email, 140, rightColumnY + 5);
    rightColumnY += 10;
  }

  // Ensure currentY is below the last drawn element, including right column
  currentY = Math.max(currentY, rightColumnY);

  // Divider Line after client details (only if any client info was added)
  if (
    clientInfo.name ||
    clientInfo.company ||
    clientInfo.brandIdentity ||
    clientInfo.email ||
    currentY > 65
  ) {
    doc.line(14, currentY + 5, 196, currentY + 5); // Adicionado um pequeno espaçamento
    currentY += 5; // Ajustar currentY após a linha
  }

  // Table Header for items
  autoTable(doc, {
    head: [["Indice", "Descrição do Item", "Subtotal", "Total do Item"]],
    body: selecionados.map((s, idx) => [
      (idx + 1).toString(),
      s.nome,
    ]),
    startY: currentY + 5,
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: {
      fillColor: [245, 245, 245],
      textColor: [0, 0, 0],
      fontStyle: "bold",
    },
    columnStyles: {
      0: { cellWidth: 15, halign: "center" },
      1: { cellWidth: 100 },
      2: { cellWidth: 35, halign: "left" },
      3: { cellWidth: 35, halign: "left" },
    },
  });

  const finalYAfterItemsTable =
    (doc as any).lastAutoTable.finalY || currentY + 5;

  // Line below Grand Total
  doc.setLineWidth(0.5);
  doc.line(140, finalYAfterItemsTable + 26, 196, finalYAfterItemsTable + 26);

  doc.save("orcamento.pdf");
};

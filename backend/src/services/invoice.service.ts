import PDFDocument from 'pdfkit'
import type { OrderDetailDto } from '../dto/order.dto.js'

function formatCurrency(amount: number, currency = 'CHF'): string {
  return `${amount.toFixed(2).replace('.', ',')} ${currency}`
}

function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('fr-CH', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

export const invoiceService = {
  async generateInvoicePdf(order: OrderDetailDto): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50, size: 'A4' })
      const chunks: Buffer[] = []

      doc.on('data', (chunk) => chunks.push(chunk))
      doc.on('end', () => resolve(Buffer.concat(chunks)))
      doc.on('error', reject)

      const vatRate = Number(process.env.INVOICE_VAT_RATE ?? 0)
      const isVatExempt = vatRate === 0

      // ===== EN-TÊTE =====
      doc.fontSize(24).font('Helvetica-Bold').fillColor('#6B4226').text('SWISSWOOD', 50, 50)
      doc.fontSize(10).font('Helvetica').fillColor('#4A4A4A')
        .text('Bois de chauffage premium & Fourneaux', 50, 75)

      // Infos société
      const companyName = process.env.BANK_OWNER || 'SwissWood SA'
      const companyAddress = process.env.COMPANY_ADDRESS || 'Adresse à compléter'
      const companyZipCity = process.env.COMPANY_ZIP_CITY || 'Ville, Pays'
      const companyVat = process.env.COMPANY_VAT_NUMBER || 'CHE-XXX.XXX.XXX'

      let y = 100
      doc.fontSize(9).font('Helvetica-Bold').text('Émetteur:', 50, y)
      y += 14
      doc.font('Helvetica').text(companyName, 50, y)
      y += 12
      doc.text(companyAddress, 50, y)
      y += 12
      doc.text(companyZipCity, 50, y)
      y += 12
      doc.text(`N° TVA: ${companyVat}`, 50, y)
      y += 12
      doc.text(`IBAN: ${process.env.BANK_IBAN || 'Non renseigné'}`, 50, y)
      y += 12
      doc.text(`BIC: ${process.env.BANK_BIC || 'Non renseigné'}`, 50, y)

      // ===== FACTURE INFO =====
      y = 100
      doc.fontSize(16).font('Helvetica-Bold').fillColor('#6B4226').text('FACTURE', 400, y, { align: 'right' })
      y += 25
      doc.fontSize(9).font('Helvetica').fillColor('#4A4A4A')
        .text(`N°: ${order.order_number}`, 400, y, { align: 'right' })
      y += 14
      doc.text(`Date: ${formatDate(order.created_at)}`, 400, y, { align: 'right' })
      y += 14
      doc.text(`Statut: ${order.status}`, 400, y, { align: 'right' })

      // ===== CLIENT =====
      y = 200
      const shipping = (order.shipping_address as Record<string, unknown>) || {}

      const clientName = `${(shipping.first_name as string) || ''} ${(shipping.last_name as string) || ''}`.trim() || 'Client'
      const clientAddress = `${(shipping.address as string) || ''} ${(shipping.zip_code as string) || ''} ${(shipping.city as string) || ''} ${(shipping.country as string) || ''}`.trim()

      doc.fontSize(9).font('Helvetica-Bold').fillColor('#6B4226').text('Facturé à:', 50, y)
      y += 14
      doc.font('Helvetica').fillColor('#4A4A4A').fontSize(9).text(clientName, 50, y)
      y += 12
      if (clientAddress) {
        doc.text(clientAddress, 50, y)
        y += 12
      }
      if (shipping.email) {
        doc.text(shipping.email as string, 50, y)
        y += 12
      }
      if (shipping.phone) {
        doc.text(shipping.phone as string, 50, y)
        y += 12
      }

      // ===== TABLEAU ARTICLES =====
      y += 10
      const tableTop = y
      const colX0 = 50, colX1 = 280, colX2 = 380, colX3 = 440, colX4 = 500
      const colW0 = 230, colW1 = 100, colW2 = 60, colW3 = 60, colW4 = 50

      doc.fontSize(9).font('Helvetica-Bold').fillColor('#FFFFFF')
      doc.rect(50, tableTop, 500, 22).fill('#6B4226')
      doc.text('Désignation', colX0 + 5, tableTop + 6)
      doc.text('Qté', colX1 + 5, tableTop + 6, { width: colW1, align: 'center' })
      doc.text('Prix un.', colX2 + 5, tableTop + 6, { width: colW2, align: 'right' })
      doc.text('TVA', colX3 + 5, tableTop + 6, { width: colW3, align: 'center' })
      doc.text('Total', colX4 + 5, tableTop + 6, { width: colW4, align: 'right' })

      let rowY = tableTop + 22
      doc.font('Helvetica').fillColor('#4A4A4A').fontSize(8)

      let totalHt = 0
      for (const item of order.items) {
        const unitPrice = item.unit_price_eur || 0
        const qty = Number(item.quantity)
        const lineTotal = unitPrice * qty
        totalHt += lineTotal

        // Alternance fond
        if (rowY % 44 > 22) {
          doc.rect(50, rowY, 500, 22).fill('#F9F5F0')
        }

        const productName = item.product?.name || 'Produit'
        doc.text(productName, colX0 + 5, rowY + 4, { width: colW0 - 10 })
        doc.text(String(qty), colX1 + 5, rowY + 6, { width: colW1, align: 'center' })
        doc.text(formatCurrency(unitPrice), colX2 + 5, rowY + 6, { width: colW2, align: 'right' })
        doc.text(isVatExempt ? 'Exempt' : `${vatRate}%`, colX3 + 5, rowY + 6, { width: colW3, align: 'center' })
        doc.text(formatCurrency(lineTotal), colX4 + 5, rowY + 6, { width: colW4, align: 'right' })

        rowY += 22

        // Éviter débordement page
        if (rowY > 720) {
          doc.addPage()
          rowY = 50
        }
      }

      // ===== TOTAUX =====
      rowY += 10
      const totalVat = isVatExempt ? 0 : totalHt * (vatRate / 100)
      const totalTtc = totalHt + totalVat

      const totals = [
        { label: 'Total HT', value: formatCurrency(totalHt) },
        ...(isVatExempt ? [] : [{ label: `TVA (${vatRate}%)`, value: formatCurrency(totalVat) }]),
        { label: 'Total TTC', value: formatCurrency(totalTtc), bold: true }
      ]

      for (const t of totals) {
        doc.font(t.bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(t.bold ? 11 : 9)
          .text(t.label, 380, rowY, { width: 100, align: 'right' })
          .text(t.value, 490, rowY, { width: 60, align: 'right' })
        rowY += t.bold ? 18 : 14
      }

      // Mention TVA si exempt
      if (isVatExempt) {
        rowY += 8
        doc.fontSize(8).font('Helvetica-Oblique').fillColor('#888888')
          .text('TVA non applicable, art. 26 LTVA', 50, rowY, { width: 500, align: 'center' })
      }

      // ===== PIED =====
      rowY += 30
      doc.fontSize(8).font('Helvetica').fillColor('#888888')
        .text('Paiement à 30 jours net. Merci de votre confiance.', 50, rowY, { width: 500, align: 'center' })
      rowY += 14
      doc.text(`SwissWood — ${companyName} — ${companyAddress}, ${companyZipCity}`, 50, rowY, { width: 500, align: 'center' })

      doc.end()
    })
  }
}
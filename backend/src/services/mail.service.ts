import nodemailer from 'nodemailer'
import { env } from '../config/env.js'

const transport = env.SMTP_HOST
  ? nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: env.SMTP_USER
        ? { user: env.SMTP_USER, pass: env.SMTP_PASS ?? '' }
        : undefined,
    })
  : null

function simulate(mail: { to: string; subject: string; text: string }): void {
  console.log('\n========== [MAIL SIMULÉ — SMTP non configuré] ==========')
  console.log(`À     : ${mail.to}`)
  console.log(`Sujet : ${mail.subject}`)
  console.log('--------------------------------------------')
  console.log(mail.text)
  console.log('======================================================\n')
}

async function send(mail: { to: string; subject: string; text: string }): Promise<void> {
  if (!transport) {
    simulate(mail)
    return
  }
  await transport.sendMail({
    from: env.MAIL_FROM,
    to: mail.to,
    subject: mail.subject,
    text: mail.text,
  })
}

export interface TransferInstructionInput {
  to: string
  orderNumber: string
  amountEur: number
  reference: string
}

export async function sendTransferInstructions(input: TransferInstructionInput): Promise<void> {
  const body = [
    `Bonjour,`,
    ``,
    `Merci pour votre commande ${input.orderNumber}.`,
    ``,
    `Pour finaliser votre règlement par virement bancaire, merci d'effectuer le transfert sur le compte suivant :`,
    ``,
    `  Bénéficiaire  : ${env.BANK_OWNER}`,
    `  IBAN          : ${env.BANK_IBAN}`,
    `  BIC           : ${env.BANK_BIC}`,
    ``,
    `  Montant       : € ${(input.amountEur / 100).toFixed(2)}`,
    `  Référence     : ${input.orderNumber}`,
    ``,
    `Votre commande est en attente de réception des fonds. Dès réception du virement, notre équipe validera votre commande et vous enverrons une confirmation par e-mail.`,
    ``,
    `Cordialement,`,
    `L'équipe SwissWood`,
  ].join('\n')

  await send({
    to: input.to,
    subject: `Instructions de paiement — Commande ${input.orderNumber}`,
    text: body,
  })
}

export async function sendPaymentConfirmation(input: { to: string; orderNumber: string; amountEur: number }): Promise<void> {
  const body = [
    `Bonjour,`,
    ``,
    `Votre paiement pour la commande ${input.orderNumber} a bien été reçu (€ ${(input.amountEur / 100).toFixed(2)}).`,
    ``,
    `Commande validée et confirmée.`,
    ``,
    `Cordialement,`,
    `L'équipe SwissWood`,
  ].join('\n')

  await send({
    to: input.to,
    subject: `Confirmation de paiement — Commande ${input.orderNumber}`,
    text: body,
  })
}

export async function sendSecurityCode(input: { to: string; orderNumber: string; code: string }): Promise<void> {
  console.log(`\n[CODE DE SÉCURITÉ] Commande ${input.orderNumber} — code : ${input.code} (destinataire : ${input.to})\n`)
}
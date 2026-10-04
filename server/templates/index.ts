import type { PageTemplate } from './types.js'
import { birthdayInvitation } from './birthdayInvitation.js'
import { datingProposal } from './datingProposal.js'
import { graduationInvitation } from './graduationInvitation.js'
import { marriageProposal } from './marriageProposal.js'
import { restaurant } from './restaurant.js'

// Sorted by id ascending (mirrors the PHP registry's ksort)
export const templates: PageTemplate[] = [
  birthdayInvitation, // birthday-invitation
  datingProposal, // dating-proposal
  graduationInvitation, // graduation-invitation
  marriageProposal, // marriage-proposal
  restaurant, // restaurant-menu
]

export function findTemplate(id: string) {
  return templates.find((t) => t.id === id)
}

export type { PageTemplate, TemplateCanvas } from './types.js'

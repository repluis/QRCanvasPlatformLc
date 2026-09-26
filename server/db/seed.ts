import { pool, query } from './connection.js'
import bcrypt from 'bcryptjs'

async function seed() {
  console.log('🌱 Seeding database...')

  try {
    // Create default templates
    const templates = [
      {
        name: 'Tarjeta de Amor',
        description: 'Una tarjeta romántica con espacio para fotos y texto',
        emoji: '💖',
        canvas_data: JSON.stringify([{
          elements: [
            { id: '1', type: 'text', x: 50, y: 50, width: 700, height: 100, content: 'Te amo', fontSize: 72, fontWeight: 'bold', fontStyle: 'normal', textDecoration: 'none', textAlign: 'center', fontFamily: 'sans-serif', color: '#ef4444' },
            { id: '2', type: 'text', x: 50, y: 180, width: 700, height: 60, content: 'Mi amor eterno', fontSize: 36, fontWeight: 'normal', fontStyle: 'italic', textDecoration: 'none', textAlign: 'center', fontFamily: 'sans-serif', color: '#1f2937' },
            { id: '3', type: 'shape', x: 350, y: 300, width: 100, height: 100, shape: 'heart', color: '#ef4444' },
          ],
          background: '#fff0f0',
          width: 800,
          height: 600,
          visible: true,
        }]),
      },
      {
        name: 'Invitación de Boda',
        description: 'Elegante invitación para tu día especial',
        emoji: '💒',
        canvas_data: JSON.stringify([{
          elements: [
            { id: '1', type: 'text', x: 100, y: 100, width: 600, height: 80, content: 'Juan & María', fontSize: 64, fontWeight: 'bold', fontStyle: 'normal', textDecoration: 'none', textAlign: 'center', fontFamily: 'serif', color: '#1f2937' },
            { id: '2', type: 'text', x: 100, y: 200, width: 600, height: 60, content: 'Se casan', fontSize: 32, fontWeight: 'normal', fontStyle: 'italic', textDecoration: 'none', textAlign: 'center', fontFamily: 'sans-serif', color: '#6b7280' },
            { id: '3', type: 'text', x: 100, y: 300, width: 600, height: 100, content: '15 de Junio, 2024\nIglesia San José • 18:00 hrs', fontSize: 24, fontWeight: 'normal', fontStyle: 'normal', textDecoration: 'none', textAlign: 'center', fontFamily: 'sans-serif', color: '#374151' },
          ],
          background: '#fafafa',
          width: 800,
          height: 600,
          visible: true,
        }]),
      },
      {
        name: 'Cumpleaños',
        description: 'Tarjeta divertida de cumpleaños con globos',
        emoji: '🎂',
        canvas_data: JSON.stringify([{
          elements: [
            { id: '1', type: 'text', x: 50, y: 50, width: 700, height: 100, content: '¡Feliz Cumpleaños!', fontSize: 64, fontWeight: 'bold', fontStyle: 'normal', textDecoration: 'none', textAlign: 'center', fontFamily: 'sans-serif', color: '#ec4899' },
            { id: '2', type: 'shape', x: 100, y: 200, width: 80, height: 80, shape: 'circle', color: '#f59e0b' },
            { id: '3', type: 'shape', x: 300, y: 180, width: 60, height: 60, shape: 'star', color: '#3b82f6' },
            { id: '4', type: 'shape', x: 600, y: 220, width: 70, height: 70, shape: 'heart', color: '#ef4444' },
            { id: '5', type: 'animation', x: 400, y: 400, width: 48, height: 48, animation: 'float-balloon', content: '🎈', color: '#ec4899', fontSize: 48 },
          ],
          background: '#fef3c7',
          width: 800,
          height: 600,
          visible: true,
        }]),
      },
    ]

    for (const template of templates) {
      await query(
        `INSERT INTO templates (name, description, emoji, canvas_data) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING`,
        [template.name, template.description, template.emoji, template.canvas_data]
      )
    }

    console.log('✅ Database seeded successfully')
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

seed()
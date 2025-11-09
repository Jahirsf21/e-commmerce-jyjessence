import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Sembrando base de datos...');

  // Crear productos de prueba
  const productos = [
    {
      nombre: 'Chanel No. 5',
      descripcion: 'Perfume clásico y elegante con notas florales',
      precio: 85.00,
      stock: 20,
      mililitros: 100,
      categoria: 'EauDeParfum',
      genero: 'Female',
      imagenesUrl: ['https://res.cloudinary.com/demo/image/upload/perfume1.jpg']
    },
    {
      nombre: 'Dior Sauvage',
      descripcion: 'Fragancia fresca y amaderada para hombre',
      precio: 75.00,
      stock: 15,
      mililitros: 100,
      categoria: 'EauDeToilette',
      genero: 'Male',
      imagenesUrl: ['https://res.cloudinary.com/demo/image/upload/perfume2.jpg']
    },
    {
      nombre: 'Versace Eros',
      descripcion: 'Perfume oriental con notas frutales',
      precio: 65.00,
      stock: 25,
      mililitros: 100,
      categoria: 'EauDeParfum',
      genero: 'Male',
      imagenesUrl: ['https://res.cloudinary.com/demo/image/upload/perfume3.jpg']
    },
    {
      nombre: 'Carolina Herrera Good Girl',
      descripcion: 'Fragancia dulce y seductora',
      precio: 80.00,
      stock: 18,
      mililitros: 80,
      categoria: 'Parfum',
      genero: 'Female',
      imagenesUrl: ['https://res.cloudinary.com/demo/image/upload/perfume4.jpg']
    },
    {
      nombre: 'Calvin Klein CK One',
      descripcion: 'Perfume fresco y unisex',
      precio: 45.00,
      stock: 30,
      mililitros: 50,
      categoria: 'EauFraiche',
      genero: 'Unisex',
      imagenesUrl: ['https://res.cloudinary.com/demo/image/upload/perfume5.jpg']
    }
  ];

  console.log('📦 Creando productos...');
  
  for (const producto of productos) {
    await prisma.producto.create({
      data: producto
    });
    console.log(`✅ Creado: ${producto.nombre}`);
  }

  console.log('\n🎉 ¡Base de datos sembrada exitosamente!');
  console.log(`📊 Total de productos creados: ${productos.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Error al sembrar la base de datos:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

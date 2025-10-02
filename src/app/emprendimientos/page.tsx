import FeaturedEmprendimientos from '@/components/FeaturedEmprendimientos';
import FeaturedObras from '@/components/FeaturedObras';

export default function EmprendimientosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sección 1: Nuevos Emprendimientos */}
      <section className="pt-4 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <FeaturedEmprendimientos />
        </div>
      </section>

      {/* Sección 2: Emprendimientos Finalizados */}
      <section className="pt-4 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <FeaturedObras />
        </div>
      </section>
    </div>
  );
}

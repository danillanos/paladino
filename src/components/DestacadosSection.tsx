import InmueblesGrid from './InmueblesGrid';

export default function DestacadosSection() {
  return (
    <section className="py-16 bg-gray-50">
      <InmueblesGrid 
        limit={12}
        title="Destacados"
        showViewAll={true}
        onlyFeatured={true}
      />
    </section>
  );
}

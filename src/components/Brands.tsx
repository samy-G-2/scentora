const brands = [
  { name: "Lattafa", tagline: "N°1 Oriental" },
  { name: "Asdaaf", tagline: "By Lattafa" },
  { name: "Rasasi", tagline: "Since 1979" },
  { name: "Afnan", tagline: "Luxe Accessible" },
  { name: "Armaf", tagline: "Performance" },
  { name: "Al Haramain", tagline: "Tradition" },
  { name: "Swiss Arabian", tagline: "Excellence" },
];

const Brands = () => {
  return (
    <section className="py-12 md:py-16 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-center text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mb-8">
          Nos Marques Partenaires
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          {brands.map((brand, i) => (
            <div key={i} className="text-center group cursor-default">
              <span className="text-xl md:text-2xl font-serif font-bold text-gray-300 group-hover:text-gold transition-colors">
                {brand.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Brands;

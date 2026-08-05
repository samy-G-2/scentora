const categories = [
  {
    id: 'homme',
    title: 'Pour Homme',
    image: 'https://www.lattafa-usa.com/cdn/shop/files/Asad-1.png?v=1747416375&width=900',
    count: '45+ Parfums'
  },
  {
    id: 'femme',
    title: 'Pour Femme',
    image: 'https://www.lattafa-usa.com/cdn/shop/files/Yara-1.png?v=1747424447&width=900',
    count: '38+ Parfums'
  },
  {
    id: 'unisex',
    title: 'Unisex',
    image: 'https://www.lattafa-usa.com/cdn/shop/files/Khamrah-1.png?v=1747418862&width=900',
    count: '25+ Parfums'
  }
];

const Categories = () => {
  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-gold text-xs font-bold uppercase tracking-[0.2em] mb-2 block">
            Explorer
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
            Par Catégorie
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <a
              key={cat.id}
              href={`#${cat.id}`}
              className="group relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden"
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              
              <div className="absolute inset-0 flex flex-col items-center justify-end p-8 text-center">
                <span className="text-gold text-xs font-bold uppercase tracking-wider mb-2">
                  {cat.count}
                </span>
                <h3 className="text-white text-2xl md:text-3xl font-serif font-bold mb-4">
                  {cat.title}
                </h3>
                <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-full text-sm font-medium uppercase tracking-wider group-hover:bg-gold group-hover:text-primary transition-colors">
                  Découvrir
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;

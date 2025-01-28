import { useEffect } from "react";
import Layout from "@/components/Layout";

export default function About() {
  useEffect(() => {
    document.title = "Tentang Kami - Albae Handicraft";
  }, []);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Tentang Albae Handicraft
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Cerita Kami</h2>
              <p className="text-muted-foreground">
                Albae Handicraft didirikan dengan semangat untuk melestarikan dan mempromosikan 
                kerajinan tangan tradisional. Perjalanan kami dimulai dengan ide sederhana: 
                menghadirkan produk kerajinan tangan autentik kepada orang-orang yang menghargai 
                keindahan karya artisan.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Misi Kami</h2>
              <p className="text-muted-foreground">
                Kami berkomitmen untuk mendukung pengrajin lokal dan melestarikan teknik kerajinan 
                tradisional sambil menghadirkan kerajinan tangan unik dan berkualitas tinggi kepada 
                pelanggan kami. Setiap karya menceritakan kisah dan membawa dedikasi dari pengrajin 
                yang terampil.
              </p>
            </section>
          </div>
          
          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Nilai-Nilai Kami</h2>
              <ul className="space-y-4 text-muted-foreground">
                <li className="flex items-start">
                  <span className="font-semibold mr-2">Kualitas:</span>
                  Setiap produk dibuat dengan penuh perhatian terhadap detail.
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">Keaslian:</span>
                  Kami merayakan teknik tradisional dan material asli.
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">Keberlanjutan:</span>
                  Kami memprioritaskan praktik dan material ramah lingkungan.
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">Komunitas:</span>
                  Mendukung pengrajin lokal dan melestarikan warisan budaya.
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}
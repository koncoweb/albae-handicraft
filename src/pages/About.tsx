
import { useEffect } from "react";
import Layout from "@/components/Layout";

export default function About() {
  useEffect(() => {
    document.title = "Tentang Kami - Albae Handicraft";
  }, []);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg mx-auto dark:prose-invert">
          <h1 className="text-4xl font-bold text-center mb-8">Tentang Kami</h1>
          
          <p>
            Albae Handicraft didirikan oleh <b>ALIMAHMUDIN, seorang warga Gang Musi , Ketandan, Jalan Yos Sudarso, Batang, 
            Jawa Tengah</b>, dengan tujuan untuk melestarikan dan mengembangkan seni kerajinan tangan 
            Indonesia, khususnya melalui produk-produk yang unik, terjangkau, dan berkualitas tinggi. 
            Berawal dari kecintaan Ali terhadap seni dan budaya lokal, Albae Handicraft kini hadir 
            untuk memenuhi kebutuhan Anda akan produk-produk kerajinan berkualitas, pakaian, dan aksesoris yang 
            tidak hanya indah, tetapi juga memiliki nilai seni dan religi yang mendalam.
          </p>

          <div className="my-8">
            <iframe 
              src="https://www.tiktok.com/embed/7433490931585666309" 
              className="w-full h-[600px] mx-auto"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Produk Kami</h2>
          <p>
            Kami menawarkan berbagai macam produk, mulai dari kaligrafi LED yang memukau, stiker 
            label yang menarik untuk berbagai kebutuhan, hingga kaos dan apparel yang стильный dengan 
            sentuhan kerajinan tangan. Setiap produk Albae Handicraft dibuat dengan cermat dan teliti 
            oleh para pengrajin terampil, menggunakan bahan-bahan berkualitas tinggi dan tahan lama yang 
            inovatif. Kami berkomitmen untuk menghadirkan produk-produk yang tidak hanya indah 
            dipandang, tetapi juga ramah lingkungan.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Visi Kami</h2>
          <p>
            Menjadi Pengrajin terpercaya yang menghasilkan produk-produk kerajinan tangan berkualitas 
            tinggi dengan desain yang unik dan inovatif, serta berkontribusi pada pelestarian budaya 
            Indonesia.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Misi Kami</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Menghasilkan produk-produk kerajinan tangan yang berkualitas tinggi dan memiliki nilai seni yang tinggi.</li>
            <li>Mengembangkan desain-desain yang inovatif dan kreatif.</li>
            <li>Mempromosikan seni kerajinan tangan Indonesia ke pasar nasional dan internasional.</li>
            <li>Memberikan pelayanan yang terbaik kepada pelanggan.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">Hubungi Kami</h2>
          <p>
            Untuk informasi lebih lanjut tentang produk-produk kami, jangan ragu untuk menghubungi 
            kami melalui WhatsApp di <a href="https://wa.me/6285867500281" className="text-primary hover:underline">
            <b>085867500281</b></a>. Kami akan dengan senang hati membantu Anda menemukan produk yang 
            sesuai dengan kebutuhan dan selera Anda.
          </p>

          <p className="text-xl font-semibold text-center mt-8 italic">
            Albae Handicraft - Sentuhan Seni dalam Setiap Produk
          </p>
        </div>
      </div>
    </Layout>
  );
}

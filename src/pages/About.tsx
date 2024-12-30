import { useEffect } from "react";
import Layout from "@/components/Layout";

export default function About() {
  useEffect(() => {
    document.title = "About Us - Albae Handicraft";
  }, []);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">About Albae Handicraft</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Story</h2>
              <p className="text-gray-600">
                Albae Handicraft was founded with a passion for preserving and promoting traditional craftsmanship. 
                Our journey began with a simple idea: to bring authentic, handcrafted products to people who appreciate 
                the beauty of artisanal work.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600">
                We are committed to supporting local artisans and preserving traditional crafting techniques while 
                bringing unique, high-quality handicrafts to our customers. Each piece tells a story and carries 
                the dedication of skilled craftspeople.
              </p>
            </section>
          </div>
          
          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Values</h2>
              <ul className="space-y-4 text-gray-600">
                <li className="flex items-start">
                  <span className="font-semibold mr-2">Quality:</span>
                  Every product is carefully crafted with attention to detail.
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">Authenticity:</span>
                  We celebrate traditional techniques and genuine materials.
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">Sustainability:</span>
                  We prioritize eco-friendly practices and materials.
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">Community:</span>
                  Supporting local artisans and preserving cultural heritage.
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}
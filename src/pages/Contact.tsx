import { useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Contact() {
  const { toast } = useToast();
  
  useEffect(() => {
    document.title = "Hubungi Kami - Albae Handicraft";
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Pesan Terkirim",
      description: "Terima kasih atas pesan Anda. Kami akan segera menghubungi Anda!",
    });
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Hubungi Kami</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nama
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Nama Anda"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="email.anda@contoh.com"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Pesan
                </label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  placeholder="Bagaimana kami dapat membantu Anda?"
                  className="min-h-[150px]"
                />
              </div>
              
              <Button type="submit" className="w-full">
                Kirim Pesan
              </Button>
            </form>
          </div>
          
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Hubungi Kami</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <MapPin className="w-5 h-5 text-gray-600 mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-900">Kunjungi Kami</h3>
                    <p className="text-gray-600">
                      Jalan Kerajinan 123<br />
                      Kawasan Artisan<br />
                      Kota Kreatif, 12345
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <Phone className="w-5 h-5 text-gray-600 mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-900">Telepon Kami</h3>
                    <p className="text-gray-600">+62 234 567 8900</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <Mail className="w-5 h-5 text-gray-600 mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-900">Email Kami</h3>
                    <p className="text-gray-600">info@albaehandicraft.com</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Jam Operasional</h2>
              <div className="space-y-2 text-gray-600">
                <p>Senin - Jumat: 09:00 - 18:00</p>
                <p>Sabtu: 10:00 - 16:00</p>
                <p>Minggu: Tutup</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
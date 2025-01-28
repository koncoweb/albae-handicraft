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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Hubungi Kami
          </h1>
          <p className="text-xl text-muted-foreground">
            Kami siap membantu Anda dengan pertanyaan atau kebutuhan Anda
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Informasi Kontak
              </h2>
              <div className="space-y-4">
                <p className="flex items-center text-muted-foreground">
                  <MapPin className="mr-2 h-5 w-5" />
                  Jl. Kerajinan No. 123, Yogyakarta
                </p>
                <p className="flex items-center text-muted-foreground">
                  <Phone className="mr-2 h-5 w-5" />
                  +62 123 4567 890
                </p>
                <p className="flex items-center text-muted-foreground">
                  <Mail className="mr-2 h-5 w-5" />
                  info@albaehandicraft.com
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Jam Operasional
              </h2>
              <div className="space-y-2 text-muted-foreground">
                <p>Senin - Jumat: 09:00 - 17:00</p>
                <p>Sabtu: 09:00 - 15:00</p>
                <p>Minggu: Tutup</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Kirim Pesan
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
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
        </div>
      </div>
    </Layout>
  );
}
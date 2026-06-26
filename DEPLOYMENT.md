# Öğrencilerle Paylaşma ve Yayına Alma

Bu proje artık tek bir Node.js uygulaması olarak yayınlanabilir. Yayında öğrenciler sadece bir web adresine girer; kurulum yapmaları gerekmez.

## En kolay yöntem

Render, Railway, Fly.io veya benzeri Node.js destekleyen bir platform kullanılabilir.

Genel ayarlar:

- Build command: `pnpm install && pnpm run build`
- Start command: `pnpm start`
- Node version: 20 veya üzeri
- Port: Platformun verdiği `PORT` ortam değişkeni otomatik kullanılır.

## Yayın akışı

1. Projeyi GitHub'a yükle.
2. Seçtiğin platformda yeni bir web service oluştur.
3. GitHub deposunu bağla.
4. Build command ve start command alanlarını yukarıdaki gibi gir.
5. Yayın tamamlandığında platform sana bir link verir.
6. Bu linki öğrencilerle paylaş.

## Yerelde üretim testi

```bash
pnpm install
pnpm run build
pnpm start
```

Sonra tarayıcıda:

```text
http://127.0.0.1:3001
```

## Not

Bu sürüm yapay zekâ API anahtarı gerektirmez. Analiz kuralları sunucuda çalışır. Daha sonra gerçek yapay zekâ servisi bağlanacaksa API anahtarı yalnızca sunucuda tutulmalıdır; arayüze yazılmamalıdır.

# RAPS Creative: Publikasi ke Cloudflare Free

Source website publik berada di folder `public/`. Konfigurasi Workers Static Assets berada di `wrangler.jsonc`.

## Production
- Domain: https://rapscreative.com
- Repository: `starpointgarageindonesia-wq/rapscreative`
- Production branch: `main`
- Worker: `rapscreative` (nama di Cloudflare harus cocok dengan field `name` di `wrangler.jsonc`)
- Root directory: `/` (root repository)
- Build command: kosong / tidak perlu
- Deploy command: `npx wrangler deploy`
- Assets folder: `./public`
- Domain routing: pastikan `rapscreative.com` masih ditautkan ke Worker yang sama di tab Domain & Routes.

## Satu kali pengaktifan, tanpa API token GitHub
1. Cloudflare Dashboard → Workers & Pages → pilih existing Worker `rapscreative`.
2. Settings → Builds → Connect → GitHub.
3. Pilih repository `starpointgarageindonesia-wq/rapscreative` dan branch `main`.
4. Pastikan root directory, build command dan deploy command sesuai konfigurasi di atas.
5. Save, lalu jalankan build/deploy production. Jika integrasi hanya berjalan setelah commit baru, lakukan push commit berikutnya pada branch `main`.
6. Cek https://rapscreative.com/harga/ dan homepage untuk membuktikan versi baru tayang.

Cloudflare menyediakan integrasi native GitHub tanpa penyimpanan API token di repository. Jangan menaruh API token, password, atau secret di source.

## QA
- Halaman promo website UMKM Rp399.000/tahun
- Rate card: `/harga/`, `/website/`, `/ugc/`, `/editing/`, `/content-creation/`, `/social-media/`
- Kalkulator add-on dan CTA WhatsApp `/harga/?service=umkm#hitung`
- Mobile, dark mode, bahasa, tautan, HTTPS

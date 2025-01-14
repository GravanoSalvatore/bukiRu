import axios from "axios";

async function fetchNewsRoutes() {
  try {
    // Подключение к вашему API
    const response = await axios.get(
      "https://min-api.cryptocompare.com/data/v2/news/?lang=RU"
    );
    const data = response.data.Data;

    // Преобразование данных в формат маршрутов
    const routes = data.map((article) => `/news/${article.id}`);

    return routes;
  } catch (error) {
    console.error("Ошибка при получении маршрутов:", error);
    return [];
  }
}

export default defineNuxtConfig({
  router: {
    scrollBehavior(to, from, savedPosition) {
      if (savedPosition) {
        return savedPosition;
      }
      return { x: 0, y: 0 };
    },
  },
  domains: [
    "min-api.cryptocompare.com",
  ],
  modules: ["@nuxtjs/sitemap", "@pinia/nuxt", "@nuxt/image"],

  sitemap: {
    hostname: "https://cryptocurrencybulls.com",
    gzip: true,
    routes: async () => {
      const newsRoutes = await fetchNewsRoutes();
      return newsRoutes;
    },
  },

  pinia: {
    autoImports: ["defineStore"],
  },

  app: {
    head: {
      title: "CryptoBulls - Последние новости криптовалют",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          hid: "description",
          name: "description",
          content:
            "Будьте в курсе последних новостей криптовалют, аналитики и трендов.",
        },
        {
          name: "keywords",
          content:
            "криптовалюты, блокчейн, Биткоин, Эфириум, новости криптовалют, тренды криптовалют",
        },
        { name: "robots", content: "index, follow" },
        {
          name: "google-site-verification",
          content: "XObUUdqlyM3Jepzd5cDkiSgUpELW3pQRPpQjY2folIA",
        },

        // Open Graph метатеги для соцсетей
        {
          property: "og:title",
          content: "CryptoBulls - Последние новости криптовалют",
        },
        {
          property: "og:description",
          content:
            "Будьте в курсе последних новостей криптовалют, аналитики и трендов.",
        },
        { property: "og:image", content: "/og-image.png" },
        { property: "og:url", content: "https://cryptobulls.com" },
        { property: "og:type", content: "website" },

        // Twitter Card метатеги для Twitter
        { name: "twitter:card", content: "summary_large_image" },
        {
          name: "twitter:title",
          content: "CryptoBulls - Последние новости криптовалют",
        },
        {
          name: "twitter:description",
          content:
            "Будьте в курсе последних новостей криптовалют, аналитики и трендов.",
        },
        { name: "twitter:image", content: "/og-image.png" },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "preload", href: "/altcoins.webp", as: "image" },
        { rel: "preload", href: "/ai.webp", as: "image" },
        { rel: "preload", href: "/crypto.webp", as: "image" },
        { rel: "preload", href: "/defi.webp", as: "image" },
        { rel: "preload", href: "/it.webp", as: "image" },
        { rel: "preload", href: "/bull.webp", as: "image" },
        {
          rel: "stylesheet",
          href: "https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.10.5/font/bootstrap-icons.min.css",
        },
        {
          rel: "stylesheet",
          href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css",
        },
      ],
    },
  },

  css: ["@/assets/css/theme.css", "bootstrap/dist/css/bootstrap.min.css"],

  compatibilityDate: "2024-04-03",
  devtools: { enabled: false },

  nitro: {
    watchOptions: {
      usePolling: true,
      interval: 1000,
      depth: 2,
    },
  },

  vite: {
    optimizeDeps: {
      include: ["axios"],
    },
  },
});

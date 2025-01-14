<template>
  <div class="container-fluid">
    <div class="row">
      <!-- Sidebar с криптовалютами -->
      <div class="col-12 col-md-3 fixed-sidebar mb-4 mb-md-0">
        <input
          v-if="!isLoading"
          style="box-shadow: none !important; border: none !important;background-color: transparent !important"
          type="text"
          v-model="searchQuery"
          placeholder="Поиск криптовалют"
          class="form-control mb-3 mt-4 text-white"
        />
        <div class="sidebar-content">
          <div
            v-for="crypto in displayedCryptos"
            :key="crypto.id"
            class="sidebar-crypto-item"
          >
            <div class="sidebar-crypto-card d-flex align-items-center">
              <div class="crypto-info ms-2">
                <h6 style="font-size: 12px;" class="crypto-name">
                  <img :src="crypto.image" class="crypto-icon" alt="crypto icon" />
                  {{ crypto.name }}: {{ crypto.current_price.toFixed(2) }} USD
                  <span
                    :class="{
                      'text-success': crypto.price_change_percentage_24h >= 0,
                      'text-danger': crypto.price_change_percentage_24h < 0
                    }"
                  >
                    <i
                      :class="{
                        'fas fa-arrow-up': crypto.price_change_percentage_24h >= 0,
                        'fas fa-arrow-down': crypto.price_change_percentage_24h < 0
                      }"
                    ></i>
                    {{ crypto.price_change_percentage_24h.toFixed(2) }}%
                  </span>
                </h6>
              </div>
            </div>
          </div>
          <span
            v-if="!isLoading && !showAllCryptos"
            @click="showAllCryptos = true"
            class="pointer fw-bold"
          >
            Open 100
          </span>
          <span
            v-if="!isLoading && showAllCryptos"
            @click="showAllCryptos = false"
            class="pointer fw-bold"
          >
            Close
            <br /><br />
          </span>
          <br /><br />
        </div>
      </div>

      <!-- Основная колонка с карточками новостей -->
      <div class="col-12 col-md-9" ref="newsContainer">
        <div class="row">
          <div
            v-for="newsItem in paginatedNews"
            :key="newsItem.id"
            class="col-12 col-md-6 col-lg-4 mb-4"
          >
            <div class="car h-100 news-card" style="max-height: 500px;">
              <img
                v-if="newsItem.urlToImage"
                :src="newsItem.urlToImage"
                class="card-img-top"
                alt="news image"
                style="height: 200px; object-fit: cover;"
              />
              <div class="card-body d-flex flex-column">
                <p>
                  {{ newsItem.author }}
                </p>
                <a :href="newsItem.url" target="_blank" class="mt-auto">
                  <h5 class="card-title">{{ newsItem.title }}</h5>
                </a>
                <p class="card-text ">{{ formatDate(newsItem.publishedAt) }}</p>
                <span style="font-size: 10px; color: cornflowerblue;">
                  {{ newsItem.categoryName }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Пагинация -->
        <div v-if="!isLoading" class="d-flex justify-content-center">
          <span class="pointer mx-2" :disabled="currentPage === 1" @click="prevPage">
            <i class="bi bi-arrow-left-square"></i>
          </span>
          <span class="pointer mx-2" :disabled="currentPage === totalPages" @click="nextPage">
            <i class="bi bi-arrow-right-square"></i>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      news: [],
      latestNews: [],
      topCryptos: [],
      currentPage: 1,
      pageSize: 9,
      isLoading: true,
      searchQuery: "",
      showAllCryptos: false,
    };
  },
  computed: {
    filteredCryptos() {
      return this.topCryptos.filter((crypto) =>
        crypto.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    displayedCryptos() {
      return this.showAllCryptos ? this.filteredCryptos : this.filteredCryptos.slice(0, 9);
    },
    totalPages() {
      return Math.ceil(this.news.length / this.pageSize);
    },
    paginatedNews() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.news.slice(start, end);
    },
  },
  async mounted() {
    await this.fetchData();
    this.isLoading = false;
  },
  methods: {
    async fetchData() {
      try {
        await this.fetchNews();
        await this.fetchTopCryptos();
      } catch (error) {
        console.error("Error loading data:", error);
      }
    },
    async fetchNews() {
      try {
        const response = await fetch(
          "https://4v-news-api.azurewebsites.net/News?SiteId=1&CategoryId=16&Page=1&PageSize=100"
        );
        const data = await response.json();
        this.news = Array.isArray(data.items) ? data.items : [];
        this.latestNews = Array.isArray(data.items) ? data.items : [];
      } catch (error) {
        console.error("Ошибка при загрузке новостей:", error);
        this.news = [];
        this.latestNews = [];
      }
    },
    async fetchTopCryptos() {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false"
        );
        const data = await response.json();
        this.topCryptos = data;
      } catch (error) {
        console.error("Ошибка при загрузке криптовалют:", error);
        this.topCryptos = [];
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString("ru-RU", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
      this.scrollToTop();
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
      this.scrollToTop();
    },
    scrollToTop() {
      this.$refs.newsContainer.scrollIntoView({ behavior: "smooth", block: "start" });
    },
  },
};
</script>

<style scoped>
::placeholder {
  color: cornflowerblue;
}

:root {
  --link-color: #000000;
  --text-color: #000000;
  --box-shadow-color: rgba(73, 69, 69, 0.3);
  background-color: #ffffff;
}

.dark-mode {
  --link-color: #ffffff;
  --text-color: #ffffff;
  --box-shadow-color: rgba(238, 235, 235, 0.3);
}

body, .dark-mode {
  color: var(--text-color);
}

a {
  color: var(--link-color);
  text-decoration: none;
}

.car {
  padding: 10px;
  box-shadow: 0 8px 16px var(--box-shadow-color);
  transition: transform 0.3s, box-shadow 0.3s;
}

.car:hover {
  transform: scale(1.05);
  box-shadow: 0 12px 20px var(--box-shadow-color);
}

.pointer {
  cursor: pointer;
}

.fixed-sidebar {
  max-height: 100vh;
  overflow-y: auto;
  position: sticky;
  top: 0;
}

.sidebar-crypto-item {
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  display: flex;
  align-items: center;
}

.crypto-icon {
  width: 25px;
  height: 25px;
  margin-right: 10px;
}

.text-success {
  color: #28a745;
}

.text-danger {
  color: #dc3545;
}

.news-card:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.card-title {
  font-size: 1.1rem;
  font-weight: bold;
}

.card-text {
  font-size: 0.9rem;
}

@media (max-width: 767px) {
  .fixed-sidebar {
    max-height: auto;
    position: static;
  }
}
</style>

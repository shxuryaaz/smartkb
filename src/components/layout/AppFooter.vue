<script setup lang="ts">
import { Github, Twitter, Mail } from 'lucide-vue-next'
</script>

<template>
  <footer class="app-footer">
    <div class="footer-container">
      <div class="footer-content">
        <div class="footer-section">
          <h3 class="footer-title">SmartKB</h3>
          <p class="footer-description">
            Modern knowledge base platform for organizing and delivering searchable content.
          </p>
          <div class="social-links">
            <a href="#" class="social-link" aria-label="GitHub">
              <Github :size="20" />
            </a>
            <a href="#" class="social-link" aria-label="Twitter">
              <Twitter :size="20" />
            </a>
            <a href="#" class="social-link" aria-label="Email">
              <Mail :size="20" />
            </a>
          </div>
        </div>

        <div class="footer-section">
          <h4 class="section-title">Categories</h4>
          <ul class="footer-links">
            <li><RouterLink to="/category/frontend">Frontend</RouterLink></li>
            <li><RouterLink to="/category/backend">Backend</RouterLink></li>
            <li><RouterLink to="/category/design">Design</RouterLink></li>
            <li><RouterLink to="/category/security">Security</RouterLink></li>
          </ul>
        </div>

        <div class="footer-section">
          <h4 class="section-title">Resources</h4>
          <ul class="footer-links">
            <li><RouterLink to="/help">Help Center</RouterLink></li>
            <li><RouterLink to="/api-docs">API Documentation</RouterLink></li>
            <li><RouterLink to="/tutorials">Tutorials</RouterLink></li>
            <li><RouterLink to="/community">Community</RouterLink></li>
          </ul>
        </div>

        <div class="footer-section">
          <h4 class="section-title">Company</h4>
          <ul class="footer-links">
            <li><RouterLink to="/about">About</RouterLink></li>
            <li><RouterLink to="/contact">Contact</RouterLink></li>
            <li><RouterLink to="/privacy">Privacy Policy</RouterLink></li>
            <li><RouterLink to="/terms">Terms of Service</RouterLink></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p class="copyright">
          © {{ new Date().getFullYear() }} SmartKB. All rights reserved.
        </p>
        <p class="powered-by">
          Built with Vue.js & TypeScript
        </p>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.app-footer {
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  margin-top: 4rem;
}

.footer-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 3rem 1rem 1.5rem;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-section {
  .footer-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 1rem;
  }

  .section-title {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 1rem;
  }

  .footer-description {
    color: var(--text-secondary);
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  border-radius: 0.5rem;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background: var(--primary-color);
    color: white;
    transform: translateY(-2px);
  }
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    margin-bottom: 0.5rem;
  }

  a {
    color: var(--text-secondary);
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: var(--primary-color);
    }
  }
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
  color: var(--text-tertiary);
  font-size: 0.875rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
}
</style>
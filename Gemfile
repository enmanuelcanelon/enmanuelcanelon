# ============================================================================
# Gemfile - Dependencias Ruby para Jekyll
# Compatible con Ruby 4.0
# ============================================================================

source "https://rubygems.org"

# Jekyll 4.x (compatible con Ruby 4.0)
gem "jekyll", "~> 4.3"

# Gemas removidas de stdlib en Ruby 3.4+/4.0
gem "csv"
gem "base64"
gem "bigdecimal"
gem "logger"

# Plugins
group :jekyll_plugins do
  gem "jekyll-seo-tag", "~> 2.8"
  gem "jekyll-sitemap", "~> 1.4"
  gem "jekyll-feed", "~> 0.17"
end

# Windows
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

# Webrick (necesario para Ruby 3.0+)
gem "webrick", "~> 1.8"

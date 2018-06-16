source :rubygems

# Server requirements
gem 'rack', '~> 1.6.0'

# Project requirements
gem "chronic"
gem "ruby-echonest", ">= 0.3.0" # https://github.com/youpy/ruby-echonest
gem "json", ">= 1.6.8"
gem 'rake'
gem 'sinatra-flash', '>= 0.3.0'
gem 'soundcloud' , '>= 0.3.0' # https://github.com/soundcloudlabs/soundcloud-ruby

# Component requirements
gem 'rack-less', '>= 3.0.2'
gem 'erubis', "~> 2.7.0"
gem 'sequel'

# Padrino Stable Gem
gem 'padrino', '0.12.9'

# Database
group :production do
  gem "pg"
end

# For dev.
group :development, :test do
  gem "heroku", ">= 3.31.0"
  gem "shotgun", ">= 0.9"
  gem "sqlite3"
end

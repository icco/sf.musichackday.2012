source :rubygems

# Server requirements
gem 'rack', "~> 1.4.1"

# Project requirements
gem "chronic"
gem "ruby-echonest", :require => 'echonest' # https://github.com/youpy/ruby-echonest
gem "json"
gem 'rake'
gem 'sinatra-flash', :require => 'sinatra/flash'
gem 'soundcloud' # https://github.com/soundcloudlabs/soundcloud-ruby

# Component requirements
gem 'rack-less'
gem 'erubis', "~> 2.7.0"
gem 'sequel'

# Padrino Stable Gem
gem 'padrino', '0.10.5'

# Database
group :production do
  gem "pg"
end

# For dev.
group :development, :test do
  gem "heroku"
  gem "shotgun"
  gem "sqlite3"
end

require 'rubygems'
require 'bundler'
require 'rake/clean'

Bundler.require

CLEAN.include("db/data.db")

namespace :db do

  desc "Bring database schema up to par."
  task :migrate do
    db_url = ENV['DATABASE_URL'] || "sqlite://db/data.db"
    migrations_dir = "./db/migrate/"

    puts "Migrating from '#{migrations_dir}' into '#{db_url}'."

    ret = Kernel.system("sequel -m #{migrations_dir} #{db_url}");

    if ret
      puts "Database migrated."
    else
      puts "Database migration failed."
    end

    puts "Database built."
  end

  desc "Delete the database"
  task :erase do
    DB = Sequel.connect(ENV['DATABASE_URL'] || 'sqlite://db/data.db')
    DB.drop_table(:sites)
    DB.drop_table(:commits)
    DB.drop_table(:schema_info)
  end

  desc "Dumps the database"
  task :dump do
    DB = Sequel.connect(ENV['DATABASE_URL'] || 'sqlite://db/data.db')

    puts "Sites Schema"
    p DB.schema :sites

    puts "Commits Schema"
    p DB.schema :commits
  end

  desc "Pulls database from Heroku."
  task :pull do
    `heroku db:pull sqlite://db/data.db --confirm happynat`
  end
end

desc "Run a local server."
task :local do
  sh "bundle exec shotgun -p 3000"
end

desc "Send an email to nat@natwelch.com if he needs to post today."
task :email_nat do
  DB = Sequel.connect(ENV['DATABASE_URL'] || 'sqlite://db/data.db')
  require './models'

  print "Emailing Nat... "
  puts Entry.send_reminder
end

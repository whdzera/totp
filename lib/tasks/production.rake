desc "Run Jekyll in production mode"
task :p do
  sh "JEKYLL_ENV=production bundle exec jekyll serve"
end
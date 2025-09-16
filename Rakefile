require "rspec/core/rake_task"
Dir.glob("lib/tasks/**/*.rake").each { |r| import r }

desc "Run RSpec tests"
RSpec::Core::RakeTask.new(:test)
Mixboard.controllers :api do
  get '/project/:user/:project/history.json' do
    prj = Project.get params['user'], params['project']
    prj.history.to_json
  end

  post '/project/:user/:project/history.json' do
    p params
  end
end

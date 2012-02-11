Mixboard.controllers :api do
  get '/api/project/:user/:project/history.json' do
    prj = Project.get params['user'], params['project']
    prj.history.to_json
  end
end

# Everything located at /

Mixboard.controller do
  layout :main
  
  get '/' do
    render :index
  end
end

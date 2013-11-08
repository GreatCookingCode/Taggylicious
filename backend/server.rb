require "vertx"
require 'json'
require 'uri'

include Vertx

server = Vertx::HttpServer.new

memos = {}

route_matcher = Vertx::RouteMatcher.new

route_matcher.get('/memos') do |request|
  request.response.chunked = true
  request.response.put_header('Content-Type', 'application/json')
  request.response.write_str(JSON.generate(memos.values))
  request.response.end
end

route_matcher.get_re('/memos/(\d+)') do |request|
  request.response.chunked = true
  request.response.put_header('Content-Type', 'application/json')
  memo_id = request.params['param0'].to_i
  request.response.write_str(JSON.generate(memos[memo_id]))
  request.response.end
end

route_matcher.post('/memos') do |request|
  body = Vertx::Buffer.create(0)

  request.data_handler do |buffer|
    body.append_buffer(buffer)
  end

  request.end_handler do
    params = URI.decode_www_form(body.to_s)

    id = memos.size + 1
    memos[id] = { id: id, name: params.assoc('name')[1], content: params.assoc('content')[1], tags: []}

    request.response.chunked = true
    request.response.put_header('Content-Type', 'application/json')
    request.response.write_str(JSON.generate(memos[id]))
    request.response.end
  end
end

route_matcher.get_re('/memos/(\d+)/tags') do |request|
  request.response.chunked = true
  request.response.put_header('Content-Type', 'application/json')
  memo_id = request.params['param0'].to_i
  request.response.write_str(JSON.generate(memos[memo_id][:tags]))
  request.response.end
end

route_matcher.post_re('/memos/(\d+)/tags') do |request|
  body = Vertx::Buffer.create(0)

  request.data_handler do |buffer|
    body.append_buffer(buffer)
  end

  request.end_handler do

    params = URI.decode_www_form(body.to_s)
    memo_id = request.params['param0'].to_i

    id = memos[memo_id][:tags].size + 1
    memos[memo_id][:tags] << { id: id, name: params.assoc('name')[1], category: params.assoc('category')[1] }

    request.response.chunked = true
    request.response.put_header('Content-Type', 'application/json')
    request.response.write_str(JSON.generate(memos[memo_id][:tags].last))
    request.response.end
  end
end

server.request_handler(route_matcher).listen(8080, '0.0.0.0')

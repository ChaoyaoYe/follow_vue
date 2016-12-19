require('./Observer').run(function(){
  require('./instantiation').run()
  require('./instantiation').run(function(){
    require('./expression')
  })
})

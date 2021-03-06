class Auction
  constructor: ->
    @init()

  init: ->
    @_socket = io.connect(appConfig.config.baseUrl, {port: appConfig.config.appPort})

    @_events =
      errorOccured    : 'error_occured'
      auctionUpdated  : 'auction_updated'
      tokensUpdated   : 'tokens_updated'

    @_findElements()
    @_attachEvents()
    @_attachListeners()

    @_timeCountDown()
    setInterval =>
      @_timeCountDown()
    , 1000

  _findElements: ->
    @_$doBidBtn     = $('.js-do-bid-btn')
    @_$timeLabels   = $('.js-time-label')
    @_$tokensCount  = $('#tokens-count')

  _attachEvents: ->
    @_attachDoBidBtnClick()

  _attachListeners: ->
    @_attachAuctionUpdatedListener()
    @_attachErrorOccuredEventListener()
    @_attachTokensUpdatedEventListener()

  _attachAuctionUpdatedListener: ->
    @_socket.on @_events.auctionUpdated,  (data)=>
      console.log(data)
      $auctionHolder = $(".js-live-auction[data-auction-id=#{data.auction._id}]")
      startingPriceParts = String(data.auction.currentPrice).split('.')
      $auctionHolder.find('.price-label .price .js-int').text(startingPriceParts[0])
      $auctionHolder.find('.price-label .price sup').text(startingPriceParts[1].substr(0, 2))

      $winnerHolder = $auctionHolder.find('.js-winner')
      if $winnerHolder.text() != data.auction.lastBidder.username
        $auctionHolder.find('.js-blinker').addClass 'blink'
        setTimeout ->
          $auctionHolder.find('.js-blinker').removeClass 'blink'
        , 1000
      console.log $winnerHolder.text()
      $winnerHolder.text(data.auction.lastBidder.username)


  _attachErrorOccuredEventListener: ->
    @_socket.on @_events.errorOccured, (data)=>
      alert 'Error:' + data.message

  _attachTokensUpdatedEventListener: ->
    @_socket.on @_events.tokensUpdated, (data)=>
      @_$tokensCount.text data.tokens

  _attachDoBidBtnClick: ->
    @_$doBidBtn.unbind 'click'
    @_$doBidBtn.click (event)=>
      auctionData =
        id: $(event.currentTarget).closest('.js-product-holder').attr('data-auction-id')
      @_socket.emit 'do_bid', auctionData


  _timeCountDown: ->
    @_$timeLabels.each (idx, el)=>
      $timeLabel = $(el)
      secsLeft = $timeLabel.attr 'data-secs-left'
      secsLeft -= 1
      $timeLabel.find('span').text @_secondsToInterval(secsLeft)

      $timeLabel.attr 'data-secs-left', secsLeft

  _secondsToInterval: (inSeconds)->
    seconds = Math.floor(inSeconds)
    days    = Math.floor(seconds / 86400);
    seconds -= days * 86400;
    hours   = Math.floor(seconds / 3600);
    seconds -= hours * 3600;
    minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;

    if (hours < 10)
      hours = "0" + hours;
    if (minutes < 10)
      minutes = "0" + minutes;

    if (seconds < 10)
      seconds = "0" + seconds;

    timeLeft = hours + ':' + minutes + ':' + seconds
    if days > 0
      timeLeft = "#{days}d " + timeLeft
    return timeLeft
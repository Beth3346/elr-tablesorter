###############################################################################
# Sort Tabular Data
###############################################################################
"use strict"

class @DrmTableSorter
    constructor: (@tableClass = 'drm-sortable-table') ->
        self = @
        self.table = $ ".#{@tableClass}"
        self.buttonClass = 'drm-sortable-table-button'

        self.table.on 'click', ".#{@buttonClass}", ->
            that = $ @
            columnNum = that.closest('th').index()
            self.addActiveClass.call @
            self.renderTable that.data('dir'), columnNum

    addActiveClass: ->
        that = $ @
        row = that.closest 'tr'
        row.find('.drm-sortable-table-button.active').removeClass 'active'
        that.addClass 'active'

    getData: (columnNum) =>
        values = []
        rows = @table.find 'tbody tr'

        $.each rows, (key, value) ->
            text = $.trim $(value).find('td').eq(columnNum).text()
            if text.length > 0 then values.push text

        values

    sortRows: (direction, columnNum) =>
        self = @
        rows = self.table.find 'tbody tr'

        _patterns =
            number: new RegExp "^(?:\\-?\\d+|\\d*)(?:\\.?\\d+|\\d)"
            alpha: new RegExp '^[a-z ,.\\-]*','i'
            # mm/dd/yyyy
            monthDayYear: new RegExp '^(?:[0]?[1-9]|[1][012]|[1-9])[-\/.](?:[0]?[1-9]|[12][0-9]|[3][01])(?:[-\/.][0-9]{4})'
            # 00:00pm
            time: new RegExp '^(?:[12][012]|[0]?[0-9]):[012345][0-9](?:am|pm)', 'i'

        _getDataType = (columnNum) ->
            types = []
            values = self.getData columnNum

            _isDate = (value) ->
                if _patterns.monthDayYear.test(value) then true else false

            _isNumber = (value) ->
                if _patterns.number.test(value) then true else false

            _isAlpha = (value) ->
                if _patterns.alpha.test(value) then true else false

            _isTime = (value) ->
                if _patterns.time.test(value) then true else false

            $.each values, (key, value) ->
                if _isDate.call self, value
                    types.push 'date'
                else if _isTime.call self, value
                    types.push 'time'
                else if _isNumber.call self, value
                    types.push 'number'
                else if _isAlpha.call self, value
                    types.push 'alpha'
                else
                    types.push null

            if $.inArray('alpha', types) isnt -1 then 'alpha' else types[0]

        type = _getDataType columnNum
        if !type
            null

        else if type is 'date'
            _sortAsc = (a, b) ->
                a = new Date _patterns.monthDayYear.exec($.trim($(a).find('td').eq(columnNum).text()))
                b = new Date _patterns.monthDayYear.exec($.trim($(b).find('td').eq(columnNum).text()))
                a - b

            _sortDesc = (a, b) ->
                a = new Date _patterns.monthDayYear.exec($.trim($(a).find('td').eq(columnNum).text()))
                b = new Date _patterns.monthDayYear.exec($.trim($(b).find('td').eq(columnNum).text()))
                b - a

            if direction is 'ascending' then rows.sort _sortAsc else rows.sort _sortDesc

        else if type is 'time'
            _parseTime = (time) ->
                hour = parseInt(/^(\d+)/.exec(time)[1], 10)
                minutes = /:(\d+)/.exec(time)[1]
                ampm = /(am|pm|AM|PM)$/.exec(time)[1].toLowerCase()

                if ampm is 'am'
                    hour = hour.toString()
                    
                    if hour is '12'
                        hour = '0'
                    else if hour.length is 1
                        hour = "0#{hour}"
                        
                    "#{hour}:#{minutes}"

                else if ampm is 'pm'
                    "#{hour + 12}:#{minutes}"

            _sortAsc = (a, b) ->
                a = _parseTime _patterns.time.exec($.trim($(a).find('td').eq(columnNum).text()))
                b = _parseTime _patterns.time.exec($.trim($(b).find('td').eq(columnNum).text()))
                new Date("04-22-2014 #{a}") - new Date("04-22-2014 #{b}")

            _sortDesc = (a, b) ->
                a = _parseTime _patterns.time.exec($.trim($(a).find('td').eq(columnNum).text()))
                b = _parseTime _patterns.time.exec($.trim($(b).find('td').eq(columnNum).text()))
                new Date("04-22-2014 #{b}") - new Date("04-22-2014 #{a}")

            if direction is 'ascending' then rows.sort _sortAsc else rows.sort _sortDesc

        else if type is 'alpha'
            _cleanAlpha = (value) ->
                # removes leading 'the' or 'a'
                value.replace(/^the /i, '').replace /^a /i, ''

            _sortAsc = (a, b) ->
                # use clean alpha to remove leading 'the' or 'a' then convert to lowercase for case insensitive sort
                a = _cleanAlpha($.trim($(a).find('td').eq(columnNum).text())).toLowerCase()
                b = _cleanAlpha($.trim($(b).find('td').eq(columnNum).text())).toLowerCase()

                if a < b
                    -1
                else if a > b
                    1
                else if a is b
                    0

            _sortDesc = (a, b) ->
                # use clean alpha to remove leading 'the' or 'a' then convert to lowercase for case insensitive sort
                a = _cleanAlpha($.trim($(a).find('td').eq(columnNum).text())).toLowerCase()
                b = _cleanAlpha($.trim($(b).find('td').eq(columnNum).text())).toLowerCase()

                if a < b
                    1
                else if a > b
                    -1
                else if a is b
                    0

            if direction is 'ascending' then rows.sort _sortAsc else rows.sort _sortDesc

        else if type is 'number'
            _sortAsc = (a, b) ->
                parseFloat($.trim($(a).find('td').eq(columnNum).text())) - parseFloat($.trim($(b).find('td').eq(columnNum).text()))

            _sortDesc = (a, b) ->
                parseFloat($.trim($(b).find('td').eq(columnNum).text())) - parseFloat($.trim($(a).find('td').eq(columnNum).text()))

            if direction is 'ascending' then rows.sort _sortAsc else rows.sort _sortDesc

    renderTable: (direction, columnNum) =>
        sortedRows = @sortRows direction, columnNum
        tableBody = @table.find('tbody').empty()

        $.each sortedRows, (key, value) ->
            tableBody.append value

new DrmTableSorter()
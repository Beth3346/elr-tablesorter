(function($) {
    window.elrTableSorter = function(params) {
        var self = {};
        var spec = params || {};
        var $table = spec.table || $('.elr-sortable-table');
        var buttonClass = spec.buttonClass || 'elr-sortable-table-button';
        var activeClass = spec.activeClass || 'active';

        var toggleActiveClass = function(className, $parent) {
            $(this).closest($parent).find('.' + className).removeClass(className);
            $(this).addClass(className);
        };

        var sortComplexList= function($listItems, dir, columnNum, types) {
            var that = this;
            var sortLists = {};

            elr.createArrays(sortLists, types);

            $.each($listItems, function() {
                var listItem = this;
                var value = $.trim($(listItem).text());

                $.each(types, function() {
                    if ( elr.dataTypeChecks['is' + elr.capitalize(this)].call(that, value) ) {
                        sortLists[this].push(listItem);
                    }

                    return sortLists;
                });
            });

            $.each(sortLists, function(k) {
                elr.comparators['sortColumn' + elr.capitalize(k)](sortLists[k], dir, columnNum);
            });

            return elr.concatArrays(sortLists);
        };

        var renderSort = function($sortedRows, $table) {
            $table.empty();

            $.each($sortedRows, function() {
                $table.append(this);
            });
        };

        $table.on('click', '.' + buttonClass, function(e) {
            var $that = $(this);
            var $tableBody = $table.find('tbody');
            var $rows = $tableBody.find('tr');
            var columnNum = $that.closest('th').index();
            var type = $table.find('th').eq(columnNum).data('type');
            var $list = elr.getColumnList(columnNum, $rows);
            var values = elr.getListValues($list);
            var types = elr.getDataTypes(values, type);
            var $sortedRows = sortComplexList($rows, $that.data('dir'), columnNum, types);

            toggleActiveClass.call(this, activeClass, 'tr');
            renderSort($sortedRows, $tableBody);

            e.preventDefault();
        });

        return self;
    };
})(jQuery);
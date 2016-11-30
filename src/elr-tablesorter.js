import elrUtlities from 'elr-utility-lib';
const $ = require('jquery');

let elr = elrUtlities();

const elrTableSorter = function({
    $table = $('.elr-sortable-table'),
    buttonClass = 'elr-sortable-table-button',
    activeClass = 'active'
} = {}) {
    // const self = {};

    const toggleActiveClass = function(className, $parent) {
        $(this).closest($parent).find(`.${className}`).removeClass(className);
        $(this).addClass(className);
    };

    const sortComplexList = function($listItems, dir, columnNum, types) {
        const that = this;
        const sortLists = {};

        elr.createArrays(sortLists, types);

        $.each($listItems, function() {
            const listItem = this;
            const value = $.trim($(listItem).find('td').eq(columnNum).text());

            $.each(types, function() {
                if ( elr[`is${elr.capitalize(this)}`](value) ) {
                    sortLists[this].push(listItem);
                }

                return sortLists;
            });
        });

        $.each(sortLists, function(k) {
            elr[`sortColumn${elr.capitalize(k)}`](sortLists[k], dir, columnNum);
        });

        return elr.concatArrays(sortLists);
    };

    const renderSort = function($sortedRows, $table) {
        $table.empty();

        $.each($sortedRows, function() {
            $table.append(this);
        });
    };

    $table.on('click', `.${buttonClass}`, function(e) {
        e.preventDefault();

        const $that = $(this);
        const $parentTable = $that.closest('table');
        const $tableBody = $parentTable.find('tbody');
        const $rows = $tableBody.find('tr');
        const columnNum = $that.closest('th').index();
        const type = $parentTable.find('th').eq(columnNum).data('type');
        const $list = elr.getColumnList(columnNum, $rows);
        const values = elr.getListValues($list);
        const types = elr.getDataTypes(values, type);
        const $sortedRows = sortComplexList($rows, $that.data('dir'), columnNum, types);

        toggleActiveClass.call(this, activeClass, 'tr');
        renderSort($sortedRows, $tableBody);
    });

    // return self;
};

export default elrTableSorter;
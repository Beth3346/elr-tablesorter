import elrUtlities from 'elr-utility-lib';
import elrUI from 'elr-ui';
const $ = require('jquery');

let elr = elrUtlities();
let ui = elrUI();

const elrTableSorter = function({
    $table = $('.elr-sortable-table'),
    buttonClass = 'elr-sortable-table-button',
    activeClass = 'active'
} = {}) {
    // const self = {};
    const sortColumnDate = function($listItems, dir, columnNum) {
        const sort = (a, b) => {
            a = elr.trim($(a).find('td').eq(columnNum).text());
            b = elr.trim($(b).find('td').eq(columnNum).text());

            if (elr.isDate(a) && elr.isDate(b)) {
                a = new Date(elr.patterns.monthDayYear.exec(a));
                b = new Date(elr.patterns.monthDayYear.exec(b));

                return elr.sortValues(a, b, dir);
            }

            return;
        };

        return $listItems.sort(sort);
    };

    const sortColumnTime = function($listItems, dir, columnNum) {
        const sort = (a, b) => {
            a = elr.trim($(a).find('td').eq(columnNum).text());
            b = elr.trim($(b).find('td').eq(columnNum).text());

            if (elr.isTime(a) && elr.isTime(b)) {
                a = new Date(`04-22-2014 ${elr.parseTime(elr.patterns.monthDayYear.exec(a))}`);
                b = new Date(`04-22-2014 ${elr.parseTime(elr.patterns.monthDayYear.exec(b))}`);
            } else {
                return;
            }

            return elr.sortValues(a, b, dir);
        };

        return $listItems.sort(sort);
    };

    const sortColumnAlpha = function($listItems, dir, columnNum) {
        const ignoreWords = ['a', 'the'];
        const sort = (a, b) => {
            a = elr.cleanAlpha(elr.trim($(a).find('td').eq(columnNum).text()), ignoreWords).toLowerCase();
            b = elr.cleanAlpha(elr.trim($(b).find('td').eq(columnNum).text()), ignoreWords).toLowerCase();

            return elr.sortValues(a, b, dir);
        };

        return $listItems.sort(sort);
    };

    const sortColumnNumber = function($listItems, dir, columnNum) {
        const sort = (a, b) => {
            a = parseFloat(elr.trim($(a).find('td').eq(columnNum).text()));
            b = parseFloat(elr.trim($(b).find('td').eq(columnNum).text()));

            return elr.sortValues(a, b, dir);
        };

        return $listItems.sort(sort);
    };

    const toggleActiveClass = function(className, $parent) {
        $(this).closest($parent).find(`.${className}`).removeClass(className);
        $(this).addClass(className);
    };

    const sortComplexList = function($listItems, dir, columnNum, types) {
        const that = this;
        const sortLists = {};

        elr.createArrays(sortLists, types);

        elr.each($listItems, function() {
            const listItem = this;
            const value = $.trim($(listItem).find('td').eq(columnNum).text());

            elr.each(types, function() {
                if ( elr[`is${elr.capitalize(this)}`](value) ) {
                    sortLists[this].push(listItem);
                }

                return sortLists;
            });
        });

        elr.each(sortLists, function(k) {
            elr[`sortColumn${elr.capitalize(k)}`](sortLists[k], dir, columnNum);
        });

        return elr.concatArrays(sortLists);
    };

    const renderSort = function($sortedRows, $table) {
        $table.empty();

        elr.each($sortedRows, function() {
            $table.append(this);
        });
    };

    const getColumnList = function(columnNum, $listItems) {
        let $list = [];

        elr.each($listItems, function(k, v) {
            $list.push($(v).find('td').eq(columnNum));

            return $list;
        });

        return $list;
    };

    $table.on('click', `.${buttonClass}`, function(e) {
        e.preventDefault();

        const $that = $(this);
        const $parentTable = $that.closest('table');
        const $tableBody = $parentTable.find('tbody');
        const $rows = $tableBody.find('tr');
        const columnNum = $that.closest('th').index();
        const type = $parentTable.find('th').eq(columnNum).data('type');
        const $list = getColumnList(columnNum, $rows);
        const values = ui.getListValues($list);
        const types = elr.getDataTypes(values, type);
        const $sortedRows = sortComplexList($rows, $that.data('dir'), columnNum, types);

        toggleActiveClass.call(this, activeClass, 'tr');
        renderSort($sortedRows, $tableBody);
    });

    // return self;
};

export default elrTableSorter;
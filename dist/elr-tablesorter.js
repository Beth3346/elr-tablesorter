'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _elrUtilities = require('elr-utilities');

var _elrUtilities2 = _interopRequireDefault(_elrUtilities);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $ = require('jquery');

var elr = (0, _elrUtilities2.default)();

var elrTableSorter = function elrTableSorter() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$$table = _ref.$table,
        $table = _ref$$table === undefined ? $('.elr-sortable-table') : _ref$$table,
        _ref$buttonClass = _ref.buttonClass,
        buttonClass = _ref$buttonClass === undefined ? 'elr-sortable-table-button' : _ref$buttonClass,
        _ref$activeClass = _ref.activeClass,
        activeClass = _ref$activeClass === undefined ? 'active' : _ref$activeClass;

    // const self = {};

    var toggleActiveClass = function toggleActiveClass(className, $parent) {
        $(this).closest($parent).find('.' + className).removeClass(className);
        $(this).addClass(className);
    };

    var sortComplexList = function sortComplexList($listItems, dir, columnNum, types) {
        var that = this;
        var sortLists = {};

        elr.createArrays(sortLists, types);

        $.each($listItems, function () {
            var listItem = this;
            var value = $.trim($(listItem).find('td').eq(columnNum).text());

            $.each(types, function () {
                if (elr['is' + elr.capitalize(this)](value)) {
                    sortLists[this].push(listItem);
                }

                return sortLists;
            });
        });

        $.each(sortLists, function (k) {
            elr['sortColumn' + elr.capitalize(k)](sortLists[k], dir, columnNum);
        });

        return elr.concatArrays(sortLists);
    };

    var renderSort = function renderSort($sortedRows, $table) {
        $table.empty();

        $.each($sortedRows, function () {
            $table.append(this);
        });
    };

    $table.on('click', '.' + buttonClass, function (e) {
        e.preventDefault();

        var $that = $(this);
        var $parentTable = $that.closest('table');
        var $tableBody = $parentTable.find('tbody');
        var $rows = $tableBody.find('tr');
        var columnNum = $that.closest('th').index();
        var type = $parentTable.find('th').eq(columnNum).data('type');
        var $list = elr.getColumnList(columnNum, $rows);
        var values = elr.getListValues($list);
        var types = elr.getDataTypes(values, type);
        var $sortedRows = sortComplexList($rows, $that.data('dir'), columnNum, types);

        toggleActiveClass.call(this, activeClass, 'tr');
        renderSort($sortedRows, $tableBody);
    });

    // return self;
};

exports.default = elrTableSorter;
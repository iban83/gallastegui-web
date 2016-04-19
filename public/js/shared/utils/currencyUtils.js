var currencyUtils = angular.module('currencyUtils', []);

currencyUtils.constant('productConstants', {
    vat: [{'id': 0, 'value': 4, 'desc': 'Tasa Superreducida'}, {'id': 1, 'value': 10, 'desc': 'Tasa Reducida'}, {'id': 2, 'value': 21, 'desc': 'Tasa General'}],
    eqSur: [{'id': 0, 'value': 1.4, 'desc': 'Tasa Reducida'}, {'id': 1, 'value': 5.2, 'desc': 'Tasa General'}]
});


/**
 * Filter provisional para mostrar el simbolo de la moneda a continuacion del valor (1.000 �), en lugar de antes del valor, como hace el filter
 * por defecto 'currency' (� 1.000)
 * 
 */
currencyUtils.filter('currencyPostfixed', ['$filter', '$locale', 
                         function($filter, $locale) {
                             return function (num) {
                                 var sym = $locale.NUMBER_FORMATS.CURRENCY_SYM;
                                 return ($filter('currency')(num)).replace(sym, "") + " " + sym;
                             };
                         }
                     ]);
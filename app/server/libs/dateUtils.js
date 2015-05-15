var du = {};
(function() {
    var DateFormatClass = Java.type("java.text.SimpleDateFormat");
    var DateClass = Java.type("java.util.Date");
    var LocaleClass = Java.type("java.util.Locale");

    du.dateToString = function(aDate) {
        if (aDate !== null) {
            var sdf = new DateFormatClass("MMM dd, yyyy hh:mm:ss a", LocaleClass.ENGLISH);
            var now = new DateClass(aDate.getTime());
            return sdf.format(now);
        } else {
            return null;
        }
    }

    du.stringToDate = function(aValue) {
        if (aValue !== null) {
            var sdf = new DateFormatClass("MMM dd, yyyy hh:mm:ss a", LocaleClass.ENGLISH);
            try {
                return new Date(sdf.parse(aValue).getTime());
            } catch (e) {
                return null;
            }
        } else {
            return null;
        }
    }

    /** (date) -> date <br> 
     * Возвращает начало дня, соответствующего заданной дате.
     * @param aDate Параметр типа date.
     * @return Значение типа date, соответствующее дате <i>aDate</i> со значением времени, установленным в 00:00:00:000.<br>
     * Если параметр <i>aDate</i> не определен, то функция вернет <code>null</code>.
     */
    du.beginOfDay = function(aDate) {
        if (aDate) {
            var dt = new Date(aDate.getTime());
            dt.setHours(0, 0, 0, 0);
            return dt;
        }
        return null;
    }

    /** (date) -> date <br>
     * Возвращает конец дня, соответствующего заданной дате.
     * @param aDate Параметр типа date.
     * @return Значение типа date, соответствующее дате <i>aDate</i> со значением времени, установленным в 23:59:59:999.<br>
     * Если параметр <i>aDate</i> не определен, то функция вернет <code>null</code>.
     */
    du.endOfDay = function(aDate) {
        if (aDate) {
            var dt = new Date(aDate.getTime());
            dt.setHours(23, 59, 59, 999);
            return dt;
        }
        return null;
    }

    /** (date, number) -> date <br> 
     * Возвращает значение параметра <i>aDate</i> типа date, увеличенное на количество часов <i>hoursAmount</i>.
     * При необходимости значения месяца или года изменяются автоматически.
     * @param aDate Параметр типа date, значение которого надо увеличить.
     * @param hoursAmount Параметр типа number. Количество часов, на которое увеличивается дата <i>aDate</i>.
     * Если значение меньше 0, то значение параметра <i>aDate</i> уменьшается.
     * @return Значение параметра <i>aDate</i> типа date, увеличенное на количество часов <i>hoursAmount</i>.<br>
     * Если параметр <i>aDate</i> не определен, то функция вернет <code>null</code>.<br>
     * Если параметр <i>hoursAmount</i> не определен, то функция вернет значение параметра <i>aDate</i>.
     */
    du.incHour = function(aDate, hoursAmount) {
        if (aDate) {
            if (hoursAmount) {
                var dt = new Date(aDate.getTime());
                dt.setHours(dt.getHours() + hoursAmount);
                return dt;
            } else
                return aDate;
        }
        return null;
    }

    /** (date, number) -> date <br>
     * Возвращает значение параметра <i>aDate</i> типа date, увеличенное на количество дней <i>daysAmount</i>.
     * При необходимости значения месяца или года изменяются автоматически.
     * @param aDate Параметр типа date, значение которого надо увеличить.
     * @param daysAmount Параметр типа number. Количество дней, на которое увеличивается дата <i>aDate</i>.
     * Если значение меньше 0, то значение параметра <i>aDate</i> уменьшается.
     * @return Значение параметра <i>aDate</i> типа date, увеличенное на количество дней <i>daysAmount</i>. Время остается без изменений.<br>
     * Если параметр <i>aDate</i> не определен, то функция вернет <code>null</code>.<br>
     * Если параметр <i>daysAmount</i> не определен, то функция вернет значение параметра <i>aDate</i>. 
     */
    du.incDay = function(aDate, daysAmount) {
        if (aDate) {
            if (daysAmount) {
                var dt = new Date(aDate.getTime());
                dt.setDate(dt.getDate() + daysAmount);
                return dt;
            } else
                return aDate;
        }
        return null;
    };

})();
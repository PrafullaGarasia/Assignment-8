$(function () {
  $.getJSON("actors.json").done(function (data) {
    let $tableBody = $('<tbody id="test"></tbody>');
    let array1 = [];
    let array2 = [];
    $.each(data.actors, function (index, value) {
      let $row = $('<tr></tr>');
      $row.append($('<td class="name"></td>').text(value.name));
      $row.append($('<td></td>').text(value.gender));
      $row.append($('<td></td>').text(value.birthday));
      $row.append($('<td></td>').text(value.married));
      $tableBody.append($row);

      if (data.actors[index].lname.charAt(0) <= "N") {
        array1.push(data.actors[index]);
      } else {
        array2.push(data.actors[index]);
      }
    });
    $('thead').after($tableBody);
    let temp = [];
    let $tds = $('.name');
    $.each($tds, function (index, value) {
      temp.push({
        element: this,
        text: $tds[index].innerText.trim().toLowerCase()
      });
    });
    $('#button1').append(`A-M (${array1.length})`).addClass('active').click(function () {
      $(this).addClass('active').siblings().removeClass('active');
      $('td').hide();
      temp.forEach(function (td) {
        if ($(td.element).text().charAt(0) <= 'N') {
          $(td.element).show();
          $(td.element).siblings().show();
        }
      });
    });

    $('#button2').append(`N-Z (${array2.length})`).addClass('active').click(function () {
      $(this).addClass('active').siblings().removeClass('active');
      $('td').hide();
      temp.forEach(function (td) {
        if ($(td.element).text().charAt(0) > 'N') {
          $(td.element).show();
          $(td.element).siblings().show();
        }
      });
    });

    let $search = $('#filter-search');
    let cache = [];

    $.each($tds, function (index, value) {
      cache.push({
        element: this,
        text: $tds[index].innerText.trim().toLowerCase()
      });


    });

    function filter() {
      let query = this.value.trim().toLowerCase();

      if (query) {
        cache.forEach(function (td) {
          let index = 0;
          index = td.text.indexOf(query);
          if (index === -1) {
            $(td.element).siblings().css("background-color", "")
            $(td.element).css("background-color", "")
          } else {
            $(td.element).siblings().css("background-color", "yellow")
            $(td.element).css("background-color", "yellow")
          }
        });
      }
      if (!query) {
        cache.forEach(function (td) {
          td.element.style.backgroundColor = "";
          $(td.element).siblings().css("background-color", "")
        });
      }
    }

    if ('oninput' in $search[0]) {
      $search.on('input', filter);
    } else {
      $search.on('keyup', filter);
    }

    let compare = {
      lname: function (a, b) {

        if (a < b) {
          return -1;
        } else {
          return a > b ? 1 : 0;
        }
      },
      date: function (a, b) {
        a = new Date(a);
        b = new Date(b);

        return a - b;
      }
    }

    let $table = $('.sort');
    let $tbody = $table.find('tbody');
    let $controls = $table.find('th');
    let rows = $tbody.find('tr').toArray();
    let orows = $tbody.find('tr').toArray();

    $controls.on('click', function () {
      let $header = $(this);
      let order = $header.data('sort');
      let column;


      if ($header.is('.ascending') || $header.is('.descending') || $header.is('.original')) {

        if ($header.is('.ascending')) {
          $header.removeClass('ascending');
          $header.addClass('descending');
          $tbody.append(rows.reverse());
        }

        else if ($header.is('.descending')) {
          $header.removeClass('descending');
          $header.addClass('original');
          $tbody.append(orows);
        }
        else {
          $header.removeClass('original');
          $header.addClass('ascending');
          $tbody.append(rows.reverse());
        }

      } else {
        $header.addClass('ascending');
        $header.siblings().removeClass('ascending descending original');
        if (compare.hasOwnProperty(order)) {
          column = $controls.index(this);
          rows.sort(function (a, b) {
            a = $(a).find('td').eq(column).text();
            b = $(b).find('td').eq(column).text();
            return compare[order](a, b);

          });
          $tbody.append(rows);
        }

      }
    });


  });
});

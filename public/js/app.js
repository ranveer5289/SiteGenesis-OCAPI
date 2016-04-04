$(function(){

    $('#category_nav').click(function(e){
        e.preventDefault();
        alert("caled");
        var obj = {};
        obj.href = $(this).attr("href");
        $.ajax({
            type : 'GET',
            contentType: 'application/json',
            dataType : 'json',
            data: JSON.stringify(obj),
            url : '/SearchShow'
        });
    });
});

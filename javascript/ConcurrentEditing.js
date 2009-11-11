var pagePingInterval = 15;

var CurrentPage = {
           id: function() { return $('Form_EditForm_ID') ? $('Form_EditForm_ID').value : null; },
    saveCount: function() { return $('SiteTree_Alert') ? $('SiteTree_Alert').getAttribute('savecount') : null; },
 setSaveCount: function(count) { if ($('SiteTree_Alert')) { $('SiteTree_Alert').setAttribute('savecount', count); } },
    isDeleted: function() { return $('SiteTree_Alert') ? $('SiteTree_Alert').getAttribute('deletedfromstage') : null; }
}

setInterval(function() {
	if ($('Form_EditForm_ID')) {
    	new Ajax.Request("admin/concurrentEditingPing?ID="+CurrentPage.id()+'&SaveCount='+CurrentPage.saveCount(), {
			onSuccess: function(t) {
				var data = eval('('+t.responseText+')');
				var hasAlert = false;
				
				switch(data.status) {
					case 'editing':
						$('SiteTree_Alert').style.border = '2px solid #B5D4FE';
						$('SiteTree_Alert').style.backgroundColor = '#F8FAFC';
						if (data.names.length) {
							hasAlert = true;
							$('SiteTree_Alert').innerHTML = "This page is also being edited by: "+data.names.join(', ');
						}
						break;
					case 'deleted':
						// handle deletion by another user (but not us, or if we're already looking at a deleted version)
						if (CurrentPage.isDeleted() == 0) {
							$('SiteTree_Alert').style.border = '2px solid #ffd324';
							$('SiteTree_Alert').style.backgroundColor = '#fff6bf';
							$('SiteTree_Alert').innerHTML = "This page has been deleted since you opened it.";
							hasAlert = true;
						}
						break;
					case 'not_current_version':
						// handle another user publishing
						$('SiteTree_Alert').style.border = '2px solid #FFD324';
						$('SiteTree_Alert').style.backgroundColor = '#fff6bf';
						$('SiteTree_Alert').innerHTML = "This page has been saved since you opened it. You may want to reload it, or risk overwriting changes.";
						hasAlert = true;
						break;
					case 'not_found':
						break;
				}
				
				if (hasAlert) {
					$('SiteTree_Alert').style.padding = '5px';
					$('SiteTree_Alert').style.marginBottom = '5px';
					$('SiteTree_Alert').style.display = 'block';
				} else {
					$('SiteTree_Alert').innerHTML = '';
					$('SiteTree_Alert').style.padding = '0px';
					$('SiteTree_Alert').style.marginBottom = '0px';
					if ($('SiteTree_Alert').style.display != 'none') $('SiteTree_Alert').style.display = 'none';
				}
			}
		});
	}
}, pagePingInterval*1000);
/* eslint-env browser */
/* eslint prefer-arrow-callback: 0, no-var: 0, object-shorthand: 0 */
/* globals $:false */

'use strict';

document.getElementById('otpsms-form').addEventListener(
    'submit',
    function(e) {
        e.preventDefault();
        e.stopPropagation();

        // var body = {
        //     _csrf: document.getElementById('_csrf').value,
        //     token: document.getElementById('token_otpsms').value
        // };
        // console.log(JSON.stringify(body));
        var btn = $(document.getElementById('otpsms-btn'));
        btn.button('loading');
        fetch('/account/security/2fa/verify-otpsms', {
            method: 'post',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ _csrf: document.getElementById('_csrf').value, sms: document.getElementById('token_otpsms').value })
        })
            .then(function(res) {
                return res.json();
            })
            .then(function(res) {
                btn.button('reset');

                if (res.error) {
                    document.getElementById('otpsms-token-field').classList.add('has-error');
                    $(document.getElementById('otpsms-token-error')).text(res.error);
                    document.getElementById('otpsms-token-error').style.display = 'block';
                    document.getElementById('token_otpsms').focus();
                    document.getElementById('token_otpsms').select();
                    return;
                }

                document.getElementById('otpsms-token-field').classList.remove('has-error');
                document.getElementById('otpsms-token-error').style.display = 'none';

                if (res.success && res.targetUrl) {
                    window.location = res.targetUrl;
                }
            })
            .catch(function(err) {
                btn.button('reset');
                document.getElementById('otpsms-token-field').classList.add('has-error');
                $(document.getElementById('otpsms-token-error')).text(err.message);
                document.getElementById('otpsms-token-error').style.display = 'block';
                document.getElementById('token_otpsms').focus();
                document.getElementById('token_otpsms').select();
            });
    },
    false
);

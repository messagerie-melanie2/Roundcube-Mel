/**
 * Roundcube editor js library
 *
 * This file is part of the Roundcube Webmail client
 *
 * @licstart  The following is the entire license notice for the
 * JavaScript code in this file.
 *
 * Copyright (c) The Roundcube Dev Team
 *
 * The JavaScript code in this page is free software: you can
 * redistribute it and/or modify it under the terms of the GNU
 * General Public License (GNU GPL) as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option)
 * any later version.  The code is distributed WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
 *
 * As additional permission under GNU GPL version 3 section 7, you
 * may distribute non-source (e.g., minimized or compacted) forms of
 * that code without the copy of the GNU GPL normally required by
 * section 4, provided you include this license notice and a URL
 * through which recipients can access the Corresponding Source.
 *
 * @licend  The above is the entire license notice
 * for the JavaScript code in this file.
 *
 * @author Eric Stadtherr <estadtherr@gmail.com>
 * @author Aleksander Machniak <alec@alec.pl>
 */

/**
 * Roundcube Text Editor Widget class
 * @constructor
 */
function rcube_text_editor(config, id)
{
  var ref = this,
    editorElement = $('#' + id),
    abs_url = location.href.replace(/[?#].*$/, '').replace(/\/$/, ''),
    conf = {
      selector: '#' + (editorElement.is('.mce_editor') ? id : 'fake-editor-id'),
      readonly: editorElement.is('[readonly],[disabled]'),
      // PAMELA - Mise à jour du build pour les langues
      cache_suffix: 's=5080203',
      theme: 'silver',
      language: config.lang,
      content_css: rcmail.assets_path(config.content_css),
      content_style: config.content_style,
      menubar: false,
      statusbar: false,
      // toolbar_sticky: true, // does not work in scrollable element: https://github.com/tinymce/tinymce/issues/5227
      toolbar_drawer: 'sliding',
      // PAMELA - toolbar
      toolbar: 'bold italic underline strikethrough | alignleft aligncenter alignright alignjustify'
        + ' | styleselect fontselect fontsizeselect | forecolor backcolor',
      extended_valid_elements: 'font[face|size|color|style],span[id|class|align|style]',
      fontsize_formats: '8pt 9pt 10pt 11pt 12pt 14pt 18pt 24pt 36pt',
      // Allow style tag, have to be allowed inside body/div/blockquote (#7088)
      valid_children: '+body[style],+blockquote[style],+div[style]',
      relative_urls: false,
      remove_script_host: false,
      convert_urls: false, // #1486944
      image_description: false,
      paste_webkit_styles: "color font-size font-family font-weight background-color",
      automatic_uploads: false, // allows to paste images
      paste_data_images: true,
      // Note: We disable contextmenu options specifically for browser_spellcheck:true.
      //       Otherwise user would have to use Right-Click with CTRL to get to
      //       the browser's spellchecker options. Should you disable browser_spellcheck
      //       you can enable other contextmenu options (by removing these options below).
      browser_spellcheck: true,
      contextmenu: 'spellchecker',
      anchor_bottom: false,
      anchor_top: false,
      file_picker_types: 'image media',
      file_picker_callback: function(callback, value, meta) { ref.file_picker_callback(callback, value, meta); },
      min_height: config.mode == 'identity' ? 100 : 400,
      deprecation_warnings: false
    };

  // register spellchecker for plain text editor
  this.spellcheck_observer = function() {};
  if (config.spellchecker) {
    this.spellchecker = config.spellchecker;
    if (config.spellcheck_observer) {
      this.spellchecker.spelling_state_observer = this.spellcheck_observer = config.spellcheck_observer;
    }
  }

  // Note: must be registered only once (#1490311)
  if (!tinymce.registered_request_token) {
    tinymce.registered_request_token = true;
    tinymce.util.XHR.on('beforeSend', function(e) {
      // secure spellchecker requests with Roundcube token
      e.xhr.setRequestHeader('X-Roundcube-Request', rcmail.env.request_token);
      // A hacky way of setting spellchecker language (there's no API for this in Tiny)
      if (e.settings && e.settings.data)
        e.settings.data = e.settings.data.replace(/^(method=[a-zA-Z]+&lang=)([^&]+)/, '$1' + rcmail.env.spell_lang);
    });
  }

  // minimal editor
  if (config.mode == 'identity' || config.mode == 'response') {
    conf.toolbar += ' | charmap hr link unlink image code $extra';
    $.extend(conf, {
      plugins: 'autolink charmap code hr image link paste tabfocus',
      file_picker_types: 'image'
    });
  }
    //PAMELA
    if (config.mode == 'forum') {
      conf.toolbar += ' | bullist numlist | charmap hr link unlink image code $extra';
      $.extend(conf, {
        plugins: 'autolink charmap code hr image link lists paste tabfocus autoresize',
        file_picker_types: 'image',
        min_height: 400,
        resize : 'vertical',
      });
      
    }
  // full-featured editor
  else { //PAMELA toolbar
    conf.toolbar += ' | bullist numlist outdent indent lineheightselect ltr rtl superscript subscript blockquote'
        + ' | link unlink table | $extra charmap image media | code searchreplace undo redo',
    $.extend(conf, {
      plugins: 'autolink charmap code directionality link lists image media nonbreaking'
        + ' paste table tabfocus searchreplace spellchecker lineheight',
      spellchecker_rpc_url: abs_url + '/?_task=utils&_action=spell_html&_remote=1',
      spellchecker_language: rcmail.env.spell_lang,
      min_height: 400,
    });
  }

  // add TinyMCE plugins/buttons from Roundcube plugin
  $.each(config.extra_plugins || [], function() {
    if (conf.plugins.indexOf(this) < 0)
      conf.plugins = conf.plugins + ' ' + this;
  });
  $.each(config.extra_buttons || [], function() {
    if (conf.toolbar.indexOf(this) < 0)
      conf.toolbar = conf.toolbar.replace('$extra', '$extra ' + this);
  });

  // disable TinyMCE plugins/buttons from Roundcube plugin
  $.each(config.disabled_plugins || [], function() {
    conf.plugins = conf.plugins.replace(this, '');
  });
  $.each(config.disabled_buttons || [], function() {
    conf.toolbar = conf.toolbar.replace(this, '');
  });

  conf.toolbar = conf.toolbar.replace('$extra', '').replace(/\|\s+\|/g, '|');

  // support external configuration settings e.g. from skin
  if (window.rcmail_editor_settings)
    $.extend(conf, window.rcmail_editor_settings);

  conf.setup = function(ed) {
    ed.on('init', function() { ref.init_callback(ed); });
    // add handler for spellcheck button state update
    ed.on('SpellcheckStart SpellcheckEnd', function(args) {
      ref.spellcheck_active = args.type == 'spellcheckstart';
      ref.spellcheck_observer();
    });
    ed.on('keypress', function() {
      rcmail.compose_type_activity++;
    });
    // make links open on shift-click
    ed.on('click', function(e) {
      var link = $(e.target).closest('a');
      if (link.length && e.shiftKey) {
        window.open(link.get(0).href, '_blank');
        return false;
      }
    });
    ed.on('focus blur', function(e) {
      $(ed.getContainer()).toggleClass('focused');
    });

    if (conf.setup_callback)
      conf.setup_callback(ed);
  };

  rcmail.triggerEvent('editor-init', {config: conf, ref: ref, id: id});

  // textarea identifier
  this.id = id;
  // reference to active editor (if in HTML mode)
  this.editor = null;
  //PAMELA - Garder la conf en mémoire
  this._conf = conf;
  this._initial_conf = {...conf};

  tinymce.init(conf);

  // react to real individual tinyMCE editor init
  this.init_callback = function(editor)
  {
    this.editor = editor;

    // Browsers have performance problems with rendering a lot of content in a textarea.
    // To workaround that we create a separate hidden textarea for the content and copy it
    // to the editor after the page is already loaded (#8108)
    var content, editorContentElement = editorElement.data('html-editor-content-element');
    if (editorContentElement && (content = $('#' + editorContentElement).val())) {
      editor.setContent(content);
      $('#' + editorContentElement).remove();
    }

    if (rcmail.env.action == 'compose') {
      var area = $('#' + this.id),
        height = $('div.tox-toolbar__group', area.parent()).first().height();

      // the editor might be still not fully loaded, making the editing area
      // inaccessible, wait and try again (#1490310)
      if (height > 200 || height > area.height()) {
        return setTimeout(function () { ref.init_callback(editor); }, 300);
      }

      var elem = rcube_find_object('_from'),
        fe = rcmail.env.compose_focus_elem;

      if (elem && elem.type == 'select-one') {
        // insert signature (only for the first time)
        if (!rcmail.env.identities_initialized)
          rcmail.change_identity(elem);

        // PAMELA - 0008128 - Baliser la signature existante en draft/edit
        if (rcmail.env.compose_mode == 'draft' || rcmail.env.compose_mode == 'edit') {
          ref._tag_existing_signature(editor);
        }

        // Focus previously focused element
        if (fe && fe.id != this.id && fe.nodeName != 'BODY') {
          window.focus(); // for WebKit (#1486674)
          fe.focus();
          rcmail.env.compose_focus_elem = null;
        }
      }
    }

    rcmail.triggerEvent('editor-load', {config: conf, ref: this});

    // set tabIndex and set focus to element that was focused before
    this.tabindex(this.force_focus || (fe && fe.id == this.id));

    // Trigger resize (needed for proper editor resizing in some browsers)
    $(window).resize();
  };

  // PAMELA - 0008128 - Baliser la signature existante dans un brouillon/modèle
  // sans marqueur id=_rc_sig pour permettre son remplacement ultérieur
  this._tag_existing_signature = function(editor)
  {
    const body = editor.getBody();

    // Déjà balisé, rien à faire
    if ($(body).find('#_rc_sig').length) {
      this._restore_sig_type_from_marker(body);
      return;
    }

    const identity_id = rcmail.env.identity;
    if (!identity_id) return;

    // Comparaison HTML normalisée
    const all_sig_maps = [
      { map: rcmail.env.signatures,               type: 'full'          },
      { map: rcmail.env.signatures_intermediaire,  type: 'intermediaire' },
      { map: rcmail.env.signatures_simple,         type: 'simple'        }
    ];

    // Normalisation, supprime tous les attributs de style, espaces superflus, ...
    const normalize = function(s) {
      return s
        .replace(/\s+style="[^"]*"/gi, '')
        .replace(/\s+class="[^"]*"/gi, '')
        .replace(/<!--[\s\S]*?-->/g, '')      
        .replace(/\s+/g, ' ')                
        .replace(/>\s+</g, '><')            
        .toLowerCase()                        
        .trim();
    };

    // Extraire le texte brut d'un élément HTML
    const strip_html = function(s) {
      return s.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
    };

    let found = false;

    // Parcourir les enfants directs du body en partant de la fin
    const $children = $(body).children();

    for (let m = 0; m < all_sig_maps.length && !found; m++) {
      const entry = all_sig_maps[m];
      if (!entry.map || !entry.map[identity_id] || !entry.map[identity_id].html) continue;

      const sig_html_ref  = entry.map[identity_id].html.trim();
      const sig_text_ref  = strip_html(sig_html_ref);
      const sig_norm_ref  = normalize(sig_html_ref);

      // Parcourir tous les éléments du body
      $children.toArray().reverse().forEach(function(child) {
        if (found) return;

        const $child = $(child);

        // Ignorer les éléments déjà marqués
        if ($child.attr('id') === '_rc_sig' || $child.attr('id') === '_rc_sig_placeholder') return;

        // Comparaison HTML normalisée sur l'enfant direct
        const child_norm = normalize($child.prop('outerHTML') || '');
        // Comparaison du innerHTML
        const child_inner_norm = normalize($child.html() || '');

        if (child_inner_norm === sig_norm_ref || child_norm.indexOf(sig_norm_ref) !== -1) {
          $child.attr({ 'id': '_rc_sig', 'data-sig-type': entry.type });
          rcmail.env.signature_type = entry.type;
          ref.update_signature_menu();
          found = true;
          return;
        }

        // Comparaison du texte brut
        const child_text = strip_html($child.html() || '').toLowerCase();
        const sig_text_lc = sig_text_ref.toLowerCase();

        if (sig_text_lc.length > 10 && child_text === sig_text_lc) {
          $child.attr({ 'id': '_rc_sig', 'data-sig-type': entry.type });
          rcmail.env.signature_type = entry.type;
          ref.update_signature_menu();
          found = true;
          return;
        }

        // Chercher dans les enfants si la signature est imbriquée
        $child.find('div, p, table, td').each(function() {
          if (found) return false;
          const $desc = $(this);
          const desc_inner_norm = normalize($desc.html() || '');
          const desc_text = strip_html($desc.html() || '').toLowerCase();

          if (desc_inner_norm === sig_norm_ref) {
            $desc.attr({ 'id': '_rc_sig', 'data-sig-type': entry.type });
            rcmail.env.signature_type = entry.type;
            ref.update_signature_menu();
            found = true;
            return false;
          }

          if (sig_text_lc.length > 10 && desc_text === sig_text_lc) {
            $desc.attr({ 'id': '_rc_sig', 'data-sig-type': entry.type });
            rcmail.env.signature_type = entry.type;
            ref.update_signature_menu();
            found = true;
            return false;
          }
        });
      });
    }

    // Si aucune signature n'est reconnue par comparaison, tentative par position :
    if (!found && !rcmail.env.compose_is_reply_or_forward) {
      let last_child = null;

      $children.toArray().reverse().forEach(function(child) {
        if (last_child) return;
        const $child = $(child);
        const text = $child.text().replace(/\u00a0/g, '').trim();
        if (text.length > 0) {
          last_child = $child;
        }
      });

      if (last_child) {
        // Vérifier que ce n'est pas clairement du contenu de l'utilisateur
        const last_text = last_child.text().trim();
        let has_any_sig = false;

        // Vérifier si ce texte existe dans une des signatures connues
        all_sig_maps.forEach(function(entry) {
          if (has_any_sig) return;
          if (!entry.map || !entry.map[identity_id]) return;
          const ref_text = strip_html(entry.map[identity_id].html || '').toLowerCase();
          if (ref_text.length > 5 && last_text.toLowerCase().indexOf(ref_text.substring(0, 20)) !== -1) {
            last_child.attr({ 'id': '_rc_sig', 'data-sig-type': entry.type });
            rcmail.env.signature_type = entry.type;
            ref.update_signature_menu();
            has_any_sig = true;
          }
        });
      }
    }
  };

  // PAMELA - 0008128 - Restaurer le type depuis data-sig-type si déjà balisé
  this._restore_sig_type_from_marker = function(body)
  {
    const existing = $(body).find('#_rc_sig');
    if (existing.length) {
      const saved_type = existing.attr('data-sig-type');
      if (saved_type && !rcmail.env.signature_type) {
        rcmail.env.signature_type = saved_type;
        this.update_signature_menu();
      }
    }
  };

  // PAMELA - 0008128 - Détecter et mémoriser la position de la signature en mode texte
  // brut, en cherchant le séparateur standard "-- "
  this._detect_plain_sig_position = function()
  {
    // PAMELA - Ne pas recalculer si déjà mémorisé
    if (typeof this.last_sig_pos_plain !== 'undefined' && this.last_sig_pos_plain >= 0) return;

    const input_message = $('#' + this.id);
    const message = input_message.val();
    if (!message) return;

    const identity_id = rcmail.env.identity;
    if (!identity_id) return;

    // PAMELA 0008128 - Normaliser les sauts de ligne pour la recherche
    const msg = message.replace(/\r\n/g, '\n');

    let sep_pos = -1;
    // PAMELA 0008128 - Tester les deux variantes du séparateur : "-- \n\n" et "-- \n"
    var sep_variants = ['-- \n\n', '-- \n'];

    for (let s = 0; s < sep_variants.length; s++) {
      const pos = rcmail.env.top_posting
        ? msg.indexOf(sep_variants[s])
        : msg.lastIndexOf(sep_variants[s]);
      if (pos >= 0) {
        sep_pos = pos;
        break;
      }
    }

    if (sep_pos < 0) return;

    // PAMELA 0008128 - Mémoriser la position du séparateur pour l'insertion de la nouvelle signature
    this.last_sig_pos_plain = sep_pos;

    // PAMELA 0008128 - Détecter le type de signature en comparant le contenu après le séparateur
    const sig_content = msg.substring(sep_pos).replace(/\r\n/g, '\n').trim();

    const all_sig_maps = [
      { map: rcmail.env.signatures,               type: 'full'          },
      { map: rcmail.env.signatures_intermediaire,  type: 'intermediaire' },
      { map: rcmail.env.signatures_simple,         type: 'simple'        }
    ];

    const normalize_for_compare = function(s) {
      return s
        .replace(/\r\n/g, '\n')
        .replace(/-- \n\n/g, '-- \n')
        .replace(/[ \t]+/g, ' ')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
    };

    const sig_content_norm = normalize_for_compare(sig_content);
    let best_type = null;
    let best_length = 0;

    for (let m = 0; m < all_sig_maps.length; m++) {
      const entry = all_sig_maps[m];
      if (!entry.map || !entry.map[identity_id] || !entry.map[identity_id].text) continue;

       ref_text = normalize_for_compare(entry.map[identity_id].text);

      // PAMELA 008128 - Prendre la correspondance la plus précise
      if (sig_content_norm.startsWith(ref_text) || sig_content_norm === ref_text) {
        if (ref_text.length > best_length) {
          best_length = ref_text.length;
          best_type = entry.type;
        }
      }
    }

    if (best_type) {
      rcmail.env.signature_type = best_type;
    }

    this.update_signature_menu();
  };

  //PAMELA - MAJ de l'éditeur
  this.update = function(editedConf)
  {
    this.editor.remove();
    this._conf = editedConf;
    tinymce.init(this._conf);

    return this;
  }

  //PAMELA - MAJ de l'éditeur
  this.update_to_dark = function()
  {
    let conf = this._conf;
    conf.content_css = "dark";
    
    return this.update(conf);
  }

  //PAMELA - Restart l'éditeur
  this.restart = function()
  {
    return this.update({...this._initial_conf});
  }

  // set tabIndex on tinymce editor
  this.tabindex = function(focus)
  {
    if (rcmail.env.task == 'mail' && this.editor) {
      var textarea = this.editor.getElement(),
        node = this.editor.getContentAreaContainer().childNodes[0];

      if (textarea && node)
        node.tabIndex = textarea.tabIndex;

      // find :prev and :next elements to get focus when tabbing away
      if (textarea.tabIndex > 0) {
        var x = null,
          tabfocus_elements = [':prev',':next'],
          el = tinymce.DOM.select('*[tabindex='+textarea.tabIndex+']:not(iframe)');

        tinymce.each(el, function(e, i) { if (e.id == ref.id) { x = i; return false; } });
        if (x !== null) {
          if (el[x-1] && el[x-1].id) {
            tabfocus_elements[0] = el[x-1].id;
          }
          if (el[x+1] && el[x+1].id) {
            tabfocus_elements[1] = el[x+1].id;
          }
          this.editor.settings.tabfocus_elements = tabfocus_elements.join(',');
        }
      }

      // ContentEditable reset fixes invisible cursor issue in Firefox < 25
      if (bw.mz && bw.vendver < 25)
        $(this.editor.getBody()).prop('contenteditable', false).prop('contenteditable', true);
    }

    if (focus)
      this.focus();
  };

  // focus the editor
  this.focus = function()
  {
    $(this.editor || ('#' + this.id)).focus();
    this.force_focus = false;
  };

  // Returns current editor mode
  this.is_html = function()
  {
    return !!this.editor;
  };

    // switch html/plain mode
    this.toggle = function(ishtml, noconvert)
    {
      var curr, content, result,
        // these non-printable chars are not removed on text2html and html2text
        // we can use them as temp signature replacement
        sig_mark = "\u0002\u0003",
        input = $('#' + this.id),

        // PAMELA - 0008128 - Plusieurs signatures
        // Sélection de la bonne map en fonction du type de signature choisi
        sig_type = rcmail.env.signature_type || 'full',
        sig_map  = rcmail.env.signatures;

      // PAMELA - 0008128 - Plusieurs signatures
      // rediriger vers les maps secondaires si nécessaire
      if (sig_type == 'intermediaire' && rcmail.env.signatures_intermediaire)
        sig_map = rcmail.env.signatures_intermediaire;
      else if (sig_type == 'simple' && rcmail.env.signatures_simple)
        sig_map = rcmail.env.signatures_simple;
      else if (sig_type == 'none')
        sig_map = null; // pas de signature active

      // signature sélectionnée dans la bonne map
      var signature = (rcmail.env.identity && sig_map)
          ? sig_map[rcmail.env.identity]
          : null,

        is_sig = signature && signature.text && signature.text.length > 1;

      // apply spellcheck changes if spell checker is active
      this.spellcheck_stop();

      if (ishtml) {
        content = input.val();

        // Normalisation des sauts de lignes pour la recherche/remplacement
        var contentNL = content.replace(/\r\n/g, "\n");

        if (is_sig && sig_type != 'none') {
          // replace current text signature with temp mark
          var sig_txt = signature.text.replace(/\r\n/g, "\n");
          contentNL = contentNL.replace(sig_txt, sig_mark);
        }
        else if (sig_type == 'none' && rcmail.env.identity) {
          // PAMELA - 0008128 - Plusieurs signatures
          // Si pas de signature demandée, on nettoie toutes les signatures 
          // du contenu texte avant conversion.
          var map_names = ['signatures', 'signatures_intermediaire', 'signatures_simple'];

          for (var i = 0; i < map_names.length; i++) {
            var map = rcmail.env[map_names[i]];
            if (map && map[rcmail.env.identity] && map[rcmail.env.identity].text) {
              var old_txt = map[rcmail.env.identity].text.replace(/\r\n/g, "\n");
              contentNL = contentNL.replace(old_txt, '');
            }
          }
        }

        // on réutilise content normalisé
        content = contentNL;

        var init_editor = function(data) {
          // replace signature mark with html version of the signature
          if (is_sig && sig_type != 'none') {
            data = data.replace(
              sig_mark,
              '<div id="_rc_sig">' + signature.html + '</div>'
            );
          }

          ref.force_focus = true;
          input.val(data);
          tinymce.execCommand('mceAddEditor', false, ref.id);
        };

        // convert to html
        if (!noconvert) {
          result = rcmail.plain2html(content, init_editor);
        }
        else {
          init_editor(content);
          result = true;
        }
      }
      else if (this.editor) {
        if (is_sig && sig_type != 'none') {
          // get current version of signature, we'll need it in
          // case of html2text conversion abort
          if (curr = this.editor.dom.get('_rc_sig'))
            curr = curr.innerHTML;

          // replace current signature with some non-printable characters
          // we use non-printable characters, because this replacement
          // is visible to the user
          // doing this after getContent() would be hard
          this.editor.dom.setHTML('_rc_sig', sig_mark);
        }

        // get html content
        content = this.editor.getContent();

        var init_plaintext = function(data) {
          tinymce.execCommand('mceRemoveEditor', false, ref.id);
          ref.editor = null;

          // replace signature mark with text version of the signature
          if (is_sig && sig_type != 'none') {
            data = data.replace(
              sig_mark,
              "\n" + signature.text
            );
          }

          input.val(data).focus().trigger('input');
          rcmail.set_caret_pos(input.get(0), 0);
        };

        // convert html to text
        if (!noconvert) {
          result = rcmail.html2plain(content, init_plaintext);
        }
        else {
          init_plaintext(input.val());
          result = true;
        }

        // bring back current signature
        if (!result && curr)
          this.editor.dom.setHTML('_rc_sig', curr);
      }

      return result;
    };


  // start spellchecker
  this.spellcheck_start = function()
  {
    if (this.editor) {
      tinymce.execCommand('mceSpellCheck', true);
      this.spellcheck_observer();
    }
    else if (this.spellchecker && this.spellchecker.spellCheck) {
      this.spellchecker.spellCheck();
    }
  };

  // stop spellchecker
  this.spellcheck_stop = function()
  {
    var ed = this.editor;

    if (ed) {
      if (ed.plugins && ed.plugins.spellchecker && this.spellcheck_active) {
        ed.execCommand('mceSpellCheck', false);
        this.spellcheck_observer();
      }
    }
    else if (ed = this.spellchecker) {
      if (ed.state && ed.state != 'ready' && ed.state != 'no_error_found')
        $(ed.spell_span).trigger('click');
    }
  };

  // spellchecker state
  this.spellcheck_state = function()
  {
    var ed;

    if (this.editor)
      return this.spellcheck_active;
    else if ((ed = this.spellchecker) && ed.state)
      return ed.state != 'ready' && ed.state != 'no_error_found';
  };

  // resume spellchecking, highlight provided misspellings without a new ajax request
  this.spellcheck_resume = function(data)
  {
    var ed = this.editor;

    if (ed) {
      ed.plugins.spellchecker.markErrors(data);
    }
    else if (ed = this.spellchecker) {
      ed.prepare(false, true);
      ed.processData(data);
    }
  };

  // get selected (spellchecker) language
  this.get_language = function()
  {
    return rcmail.env.spell_lang;
  };

  // set language for spellchecking
  this.set_language = function(lang)
  {
    var ed = this.editor;

    if (ed) {
      // TODO: this has no effect in recent Tiny versions
      ed.settings.spellchecker_language = lang;
    }
    if (ed = this.spellchecker) {
      ed.setCurrentLanguage(lang);
    }

    rcmail.env.spell_lang = lang;
  };

  // replace selection with text snippet
  // input can be a string or object with 'text' and 'html' properties
  this.replace = function(input)
  {
    var format, ed = this.editor;

    if (!input)
      return false;

    // insert into tinymce editor
    if (ed) {
      ed.getWin().focus(); // correct focus in IE & Chrome

      if ($.type(input) == 'object' && ('html' in input)) {
        input = input.html;
        format = 'html';
      }
      else {
        if ($.type(input) == 'object')
          input = input.text || '';

        input = rcmail.quote_html(input).replace(/\r?\n/g, '<br/>');
        format = 'text';
      }

      ed.selection.setContent(input, {format: format});
    }
    // replace selection in compose textarea
    else if (ed = rcube_find_object(this.id)) {
      var selection = rcmail.get_input_selection(ed),
        value = ed.value,
        pre = value.substring(0, selection.start),
        end = value.substring(selection.end, value.length);

      if ($.type(input) == 'object')
        input = input.text || '';

      // insert response text
      ed.value = pre + input + end;

      // set caret after inserted text
      rcmail.set_caret_pos(ed, selection.start + input.length);
      ed.focus();
    }
  };

  // Fill the editor with specified content
  // TODO: support format conversion
  this.set_content = function(content)
  {
    if (this.editor) {
      this.editor.setContent(content);
      this.editor.getWin().focus();
    }
    else if (ed = rcube_find_object(this.id)) {
      $(ed).val(content).focus();
    }
  };

  // get selected text (if no selection returns all text) from the editor
  this.get_content = function(args)
  {
    var sigstart, ed = this.editor, text = '', strip = false,
      defaults = {refresh: true, selection: false, nosig: false, format: 'html'};

    if (!args)
      args = defaults;
    else
      args = $.extend(defaults, args);

    // apply spellcheck changes if spell checker is active
    if (args.refresh) {
      this.spellcheck_stop();
    }

    // get selected text from tinymce editor
    if (ed) {
      if (args.selection)
        text = ed.selection.getContent({format: args.format});

      if (!text) {
        text = ed.getContent({format: args.format});
        // @todo: strip signature in html mode
        strip = args.format == 'text';
      }
    }
    // get selected text from compose textarea
    else if (ed = rcube_find_object(this.id)) {
      if (args.selection) {
        text = rcmail.get_input_selection(ed).text;
      }

      if (!text) {
        text = ed.value;
        strip = true;
      }
    }

    // strip off signature
    // @todo: make this optional
    if (strip && args.nosig) {
      sigstart = text.indexOf('-- \n');
      if (sigstart > 0) {
        text = text.substring(0, sigstart);
      }
    }

    return text;
  };

  // change user signature text
  this.change_signature = function(id, show_sig)
  {
    var position_element, cursor_pos, p = -1,
      input_message = $('#' + this.id),
      message = input_message.val(),
      sig = rcmail.env.identity;

      // PAMELA - 0008128 - Plusieurs signatures
      // Mémorise la dernière position connue de la signature en mode texte
      if (typeof this.last_sig_pos_plain === 'undefined') {
        this.last_sig_pos_plain = -1;
      }
    // PAMELA - 0008128 - Plusieurs signatures
    // helper pour ajouter un seul <br> avant la signature en HTML
    var insert_single_br_before = function(elem) {
      var $elem = $(elem);
      var prev = $elem.prev();

      // S'il y a déjà un <br> juste avant, on ne rajoute rien
      if (prev.length && prev.is('br')) {
        return;
      }

      // Sinon on insère un <br> avant la signature
      $('<br>').insertBefore($elem);
    };
    // PAMELA - 0008128 - Plusieurs signatures
    // Choix automatique du type de signature (full/intermediaire/simple)
    // si l'utilisateur n'a pas déjà choisi via le menu
    if (!rcmail.env.signature_type) {
      var mode     = rcmail.env.show_sig_mode || 0; // 0–12 (config show_sig)
      var is_reply = !!rcmail.env.compose_is_reply_or_forward;
      var auto_type = null;

      switch (mode) {
        case 1:  // toujours avoir la signature complète
          auto_type = 'full';
          break;
        case 2:  // toujours avoir la signature intermédiaire
          auto_type = 'intermediaire';
          break;
        case 3:  // toujours avoir la signature simple
          auto_type = 'simple';
          break;
        case 4:  // nouveau message = complète / réponse+transfert = intermédiaire
          auto_type = is_reply ? 'intermediaire' : 'full';
          break;
        case 5:  // nouveau message = complète / réponse+transfert = simple
          auto_type = is_reply ? 'simple' : 'full';
          break;
        case 6:  // nouveau message = intermédiaire / réponse+transfert = simple
          auto_type = is_reply ? 'simple' : 'intermediaire';
          break;
        case 7:  // nouveau message uniquement = complète
          auto_type = is_reply ? null : 'full';
          break;
        case 8:  // nouveau message uniquement = intermédiaire
          auto_type = is_reply ? null : 'intermediaire';
          break;
        case 9:  // nouveau message uniquement = simple
          auto_type = is_reply ? null : 'simple';
          break;
        case 10: // réponse+transfert uniquement = complète
          auto_type = is_reply ? 'full' : null;
          break;
        case 11: // réponse+transfert uniquement = intermédiaire
          auto_type = is_reply ? 'intermediaire' : null;
          break;
        case 12: // réponse+transfert uniquement = simple
          auto_type = is_reply ? 'simple' : null;
          break;
        default: // 0 = jamais
          auto_type = null;
      }

      // Si dans ce contexte il ne faut pas de signature, on ne fait rien
      if (!auto_type) {
        if (show_sig) {
          return;
        }
      }
      else {
        rcmail.env.signature_type = auto_type;
      }
    }

    // --- MODE TEXTE ---
    if (!this.editor) { // plain text mode
      // PAMELA - 0008128 - Plusieurs signatures 
      // Type de signature à utiliser (full/intermediaire/simple)
      const sig_type = rcmail.env.signature_type || 'full';

      // PAMELA - 0008128 - Plusieurs signatures
      // Suppression de l'ancienne signature
      if (show_sig && sig && (rcmail.env.signatures || rcmail.env.signatures_intermediaire || rcmail.env.signatures_simple)) {

        // Suppression de l'ancienne signature en texte brut
        // On cherche le séparateur -- et on supprime tout depuis ce point
        const msg_nl = message.replace(/\r\n/g, '\n');
        let sep_pos_found = -1;
        const sep_variants_del = ['-- \n\n', '-- \n'];

        for (let s = 0; s < sep_variants_del.length; s++) {
          const sp = rcmail.env.top_posting
            ? msg_nl.indexOf(sep_variants_del[s])
            : msg_nl.lastIndexOf(sep_variants_del[s]);
          if (sp >= 0) {
            sep_pos_found = sp;
            break;
          }
        }

        if (sep_pos_found >= 0) {
          // Supprimer tout depuis le séparateur jusqu'à la fin
          message = message.substring(0, sep_pos_found);
          p = sep_pos_found;
          this.last_sig_pos_plain = sep_pos_found;
        }
        else if (this.last_sig_pos_plain >= 0) {
          // Fallback : utiliser la position mémorisée
          p = this.last_sig_pos_plain;
          message = message.substring(0, p);
        }
      }

      // PAMELA - 0008128 - Plusieurs signatures
      // Choix de la map de signatures en fonction du type
      var sig_map = rcmail.env.signatures; // par défaut: signature complète
      if (sig_type == 'intermediaire' && rcmail.env.signatures_intermediaire)
        sig_map = rcmail.env.signatures_intermediaire;
      else if (sig_type == 'simple' && rcmail.env.signatures_simple)
        sig_map = rcmail.env.signatures_simple;
      else if (sig_type == 'none') {
        sig_map = null; // pas de nouvelle signature
      }

      // add the new signature string
      if (show_sig && sig_type != 'none' && sig_map && sig_map[id]) {
        sig = sig_map[id].text;
        sig = sig.replace(/\r\n/g, '\n');

        // PAMELA - 0008128 - Plusieurs signatures
        // position d'insertion de la signature
        var sig_insert_pos = -1;

        // si on trouve une ancienne signature dans le message
        if (p >= 0) {
          sig_insert_pos = p;
        }
        // si on a mémorisé une position lors d'un appel précédent
        else if (typeof this.last_sig_pos_plain === 'number'
            && this.last_sig_pos_plain >= 0
            && this.last_sig_pos_plain <= message.length) {
          sig_insert_pos = this.last_sig_pos_plain;
        }

        // in place of removed signature (ou de l'ancien emplacement mémorisé)
        if (sig_insert_pos >= 0) {
          message = message.substring(0, sig_insert_pos) + sig + message.substring(sig_insert_pos, message.length);
          cursor_pos = sig_insert_pos - 1;

          // on met à jour la dernière position connue
          this.last_sig_pos_plain = sig_insert_pos;
        }
        // empty message or new-message mode
        else if (!message || !rcmail.env.compose_mode) {
          cursor_pos = message.length;
          message += '\n\n' + sig;
        }
        else if (rcmail.env.top_posting && !rcmail.env.sig_below) {
          // at cursor position
          if (pos = rcmail.get_caret_pos(input_message.get(0))) {
            message = message.substring(0, pos) + '\n' + sig + '\n\n' + message.substring(pos, message.length);
            cursor_pos = pos;
          }
          // on top
          else {
            message = '\n\n' + sig + '\n\n' + message.replace(/^[\r\n]+/, '');
            cursor_pos = 0;
          }
        }
        else {
          message = message.replace(/[\r\n]+$/, '');
          cursor_pos = !rcmail.env.top_posting && message.length ? message.length + 1 : 0;
          message += '\n\n' + sig;
        }
      }
      else {
        cursor_pos = rcmail.env.top_posting ? 0 : message.length;
      }

      input_message.val(message);

      // move cursor before the signature
      rcmail.set_caret_pos(input_message.get(0), cursor_pos);
    }

    // --- MODE HTML ---
    else if (show_sig) {  // html mode
      var body   = this.editor.getBody(),
          sigElem;
      // PAMELA - 0008128 - Plusieurs signatures
      // Type de signature HTML et map
      var sig_type_html = rcmail.env.signature_type || 'full',
          sig_map_html  = rcmail.env.signatures;

      if (sig_type_html == 'intermediaire' && rcmail.env.signatures_intermediaire)
        sig_map_html = rcmail.env.signatures_intermediaire;
      else if (sig_type_html == 'simple' && rcmail.env.signatures_simple)
        sig_map_html = rcmail.env.signatures_simple;

      // PAMELA - 0008128 - Brouillon/modèle : détecter une signature existante
      // sans marqueur id=_rc_sig et la baliser pour pouvoir la remplacer ensuite
      if (!$(body).find('#_rc_sig').length && (rcmail.env.compose_mode == 'draft' || rcmail.env.compose_mode == 'edit')) {
        const all_sig_maps = [
          rcmail.env.signatures,
          rcmail.env.signatures_intermediaire,
          rcmail.env.signatures_simple
        ];

        let found = false;
        for (let m = 0; m < all_sig_maps.length && !found; m++) {
          const map = all_sig_maps[m];
          if (!map || !rcmail.env.identity || !map[rcmail.env.identity]) continue;

          const sig_html = map[rcmail.env.identity].html;
          if (!sig_html) continue;

          // Chercher dans le corps un élément dont le innerHTML correspond à la signature
          $(body).find('div, p, span').each(function() {
            if (found) return false;

            const elem_html = this.innerHTML.trim();
            const sig_trimmed = sig_html.trim();

            const normalize = function(s) {
              return s.replace(/\s+/g, ' ').replace(/>\s+</g, '><').trim();
            };

            if (normalize(elem_html) === normalize(sig_trimmed)) {
              $(this).attr('id', '_rc_sig');
              found = true;
              return false;
            }
          });
        }
      }

      // PAMELA - 0008128 - Plusieurs signatures
      // Suppression des anciennes signatures HTML
      // + nettoyage des <p> vides juste autour
      $(body).find('#_rc_sig').each(function () {
        var $sig  = $(this),
            $prev = $sig.prev('p'),
            $next = $sig.next('p');

        // On garde un placeholder à la place de l’ancienne signature
        if (!$(body).find('#_rc_sig_placeholder').length) {
          // ajout &nbsp; pour éviter que TinyMCE ne supprime le span si vide
          $('<span id="_rc_sig_placeholder">&nbsp;</span>').insertBefore($sig);
        }

        // est ce qu'un <p> est "vide"
        var clean_if_empty = function ($p) {
          if (!$p.length) return;
          // texte vide (ou juste espaces / nbsp)
          var txt = $p.text().replace(/\u00a0/g, '').trim();
          if (txt.length) return;

          // uniquement des <br> éventuellement
          var only_br = true;
          $p.contents().each(function () {
            if (this.nodeType === 1 && this.nodeName !== 'BR') {
              only_br = false;
              return false;
            }
          });

          if (only_br) {
            $p.remove();
          }
        };

        clean_if_empty($prev);
        clean_if_empty($next);

        $sig.remove();
      });

      sigElem = null;

      // PAMELA - 0008128 - Plusieurs signatures
      // Si type = none, on n'insère rien, mais on garde le placeholder
      if (sig_type_html == 'none') {
        if (!rcmail.env.top_posting) {
          position_element = $(body).children().last();
        }

        this.update_signature_menu();
        return;
      }

      // PAMELA - 0008128 - Plusieurs signatures
      if (sig_map_html && sig_map_html[id]) {
        sigElem = $('<div id="_rc_sig" data-sig-type="' + sig_type_html + '"></div>').get(0);
        sigElem.innerHTML = sig_map_html[id].html;

        // Si on a un placeholder, on réutilise strictement cette position
        var $placeholder = $(body).find('#_rc_sig_placeholder');
        if ($placeholder.length) {

            // Supprimer les <br> ou espaces multiples avant le placeholder
            var prev = $placeholder.prev();
            if (prev.length && prev.is('br')) {
                prev.remove();
            }

            // Insérer exactement une ligne vide
            $placeholder.after('<br>');

            // Insérer la signature après cette ligne vide
            $placeholder.next().after(sigElem);

            position_element = $(sigElem);

            // retirer le placeholder
            $placeholder.remove();
        }
        else if (rcmail.env.compose_is_reply_or_forward) {
          // Gestion pour les réponses/transferts en HTML
          // Chercher la ligne de citation selon le type de message
          var allElements = $(body).find('*');
          var originalContentStart = null;
          var is_forward = false;
          
          // Détecter le type de citation en fonction du motif
          allElements.each(function() {
            var text = $(this).text().trim();
            var html = $(this).html();
            
            // Pour les réponses : motif "Le JJ/MM/AAAA HH:MM, ... a écrit :"
            if (text.match(/^Le\s+\d{1,2}\/\d{1,2}\/\d{4}\s+\d{1,2}:\d{2},\s+.+\s+a\s+écrit\s*:/)) {
              originalContentStart = $(this);
              is_forward = false;
              return false;
            }
            // Pour les transferts : motif "Courriel original"
            else if (text.includes('Courriel original') || html.includes('Courriel original')) {
              originalContentStart = $(this);
              is_forward = true;
              return false;
            }
            // Vérifier aussi le parent si le texte est découpé
            else if ($(this).find(':contains("Courriel original")').length > 0) {
              originalContentStart = $(this).find(':contains("Courriel original")').first();
              is_forward = true;
              return false;
            }
          });
          
          // Vérifie si l'utilisateur a déjà rédigé du texte
          var userHasContent = false;
          var lastUserElement = null;
          
          // Si on a trouvé le début du contenu original
          if (originalContentStart) {
            if (is_forward) {
              // Transfert : remonter au conteneur principal si besoin
              var $container = originalContentStart;
              var containerText = $container.text();
              
              if (!containerText.includes('Date:') && !containerText.includes('De:')) {
                $container = $container.closest('div, p, blockquote, table');
              }
              
              if ($container.length > 0) {
                originalContentStart = $container;
              }
            }
            
            // Chercher les blocs AVANT le contenu original au niveau des enfants directs du body
            var elementsBeforeOriginal = [];
            var foundOriginal = false;

            $(body).children().each(function () {
              if (foundOriginal) {
                return;
              }

              var $elem = $(this);

              if ($elem.is(originalContentStart) || $elem.find(originalContentStart).length > 0) {
                foundOriginal = true;
                return;
              }

              var text = $elem.text().replace(/\u00a0/g, ' ').trim();
              if (!text.length) {
                return;
              }

              elementsBeforeOriginal.push({
                element: this,
                text: text
              });
            });

            // Cherche le dernier élément non-vide avant le contenu original
            for (var i = elementsBeforeOriginal.length - 1; i >= 0; i--) {
              var elemData = elementsBeforeOriginal[i];
              var text = elemData.text;

              // Ignorer les métadonnées typiques (lignes "De :", "À :", ...)
              if (
                text.length > 2 &&
                !/^De\s*:/.test(text) &&
                !/^À\s*:/.test(text) &&
                !/^Objet\s*:/.test(text) &&
                !/^Date\s*:/.test(text) &&
                !/Courriel original/i.test(text) &&
                !/^Le\s+\d{1,2}\/\d{1,2}\/\d{4}\s+\d{1,2}:\d{2},\s+.+\s+a\s+écrit\s*:/.test(text)
              ) {
                userHasContent = true;
                lastUserElement = elemData.element;
                break;
              }
            }
            
            if (userHasContent && lastUserElement) {
              // L'utilisateur a déjà rédigé une réponse alors on insére la signature après sa réponse
              $(lastUserElement).after(sigElem);
              insert_single_br_before(sigElem);
              position_element = $(sigElem);
            } else {
              // Pas de réponse de l'utilisateur, alors insérer la signature avant le contenu original
              $(originalContentStart).before(sigElem);
              insert_single_br_before(sigElem);
              position_element = $(sigElem);
            }
          } else {
            // si aucune ligne de citation détectée, alors on cherche du contenu utilisateur
            var allChildren = $(body).children();
            var nonEmptyElements = [];
            
            allChildren.each(function() {
              var $elem = $(this);
              var text = $elem.text().replace(/\u00a0/g, ' ').trim();
              
              // Ignorer les signatures
              if (!$elem.is('#_rc_sig') && text.length > 0) {
                nonEmptyElements.push({
                  element: this,
                  text: text
                });
              }
            });
            
            if (nonEmptyElements.length > 0) {
              // Prendre le dernier élément non-vide
              var lastElemData = nonEmptyElements[nonEmptyElements.length - 1];
              var $lastElem = $(lastElemData.element);
              
              // Vérifier si c'est du contenu utilisateur (pas une métadonnée)
              var text = lastElemData.text;
              if (!text.includes('De :') && 
                  !text.includes('À :') && 
                  !text.includes('Objet :') &&
                  !text.includes('Date :') &&
                  !text.includes('Date:') &&
                  !text.includes('Courriel original') &&
                  !text.match(/^Le\s+\d{1,2}\/\d{1,2}\/\d{4}\s+\d{1,2}:\d{2},\s+.+\s+a\s+écrit\s*:/)) {
                
                // Insérer la signature après le dernier contenu utilisateur
                $lastElem.after(sigElem);
                insert_single_br_before(sigElem);
                position_element = $(sigElem);
              } else {
                // si métadonnée insérer la signature à la fin
                $(body).append(sigElem);
                insert_single_br_before(sigElem);
                position_element = $(sigElem);
              }
            } else {
              // Pas de contenu du tout, insérer à la fin
              $(body).append(sigElem);
              insert_single_br_before(sigElem);
              position_element = $(sigElem);
            }
          }
        }
        else {
          // Nouveau message uniquement
          var is_top_posting2 = rcmail.env.top_posting && !rcmail.env.sig_below
            && rcmail.env.compose_mode && (body.childNodes.length > 1 || $(body).text());

          if (is_top_posting2) {
            // Insérer au début
            $(body).prepend(sigElem);
            insert_single_br_before(sigElem);
            position_element = $(sigElem);
          } else {
            // Ajouter à la fin
            $(body).append(sigElem);
            insert_single_br_before(sigElem);
            position_element = $(sigElem);
          }
        }
      }
    }
    else if (!rcmail.env.top_posting) {
      position_element = $(this.editor.getBody()).children().last();
    }

    // put cursor before signature and scroll the window
    if (this.editor && position_element && position_element.length) {
      this.editor.focus();

      var range = this.editor.selection.getRng();
      range.setStartBefore(position_element[0]);
      range.setEndBefore(position_element[0]);
      this.editor.selection.setRng(range);

      this.editor.getWin().scroll(0, position_element.offset().top);
    }

    // PAMELA - 0008128 - Plusieurs signatures
    // Mettre à jour la coche dans le menu signature après avoir changé la signature
    if (show_sig) {
      this.update_signature_menu();
    }
  };

  // PAMELA - 0008128 - Plusieurs signatures
  // Fonction pour mettre à jour les coches dans le menu des signatures
  this.update_signature_menu = function() {
    var sig_type = rcmail.env.signature_type || 'full';
    
    // Masquer toutes les coches
    $('#sigmenu .sig-checkmark').hide();
    
    // Afficher la coche pour la signature active
    $('#sigmenu-' + sig_type + ' .sig-checkmark').show();
  };

  // trigger content save
  this.save = function()
  {
    if (this.editor) {
      this.editor.save();
    }
  };

  // focus the editing area
  this.focus = function()
  {
    (this.editor || rcube_find_object(this.id)).focus();
  };

  // image selector
  this.file_picker_callback = function(callback, value, meta)
  {
    var i, button, elem, cancel, dialog, fn, hint, list = [],
      type = meta.filetype,
      form = $('.upload-form').clone();

    // open image selector dialog
    this.editor.windowManager.open({
      title: rcmail.get_label('select' + type),
      body: {
        type: 'panel',
        items: [{
          type: 'htmlpanel',
          html: '<div id="image-selector" class="image-selector file-upload"><ul id="image-selector-list" class="attachmentslist"></ul></div>',
        }]
      },
      buttons: [{type: 'cancel', text: rcmail.get_label('close'), onclick: function() { ref.file_picker_close(); }}]
    });

    rcmail.env.file_picker_callback = callback;
    rcmail.env.file_picker_type = type;

    dialog = $('#image-selector');

    if (!form.length)
      form = this.file_upload_form(rcmail.gui_objects.uploadform);
    else
      form.find('button,a.button').slice(1).remove(); // need only the first button

    button = dialog.prepend(form).find('button,a.button')
      .text(rcmail.get_label('add' + type))
      .focus();

    if (!button.is('.btn'))
      button.addClass('tox-button');

    // fill images list with available images
    for (i in rcmail.env.attachments) {
      if (elem = ref.file_picker_entry(i, rcmail.env.attachments[i])) {
        list.push(elem);
      }
    }

    cancel = dialog.parents('.tox-dialog').find('button').last();

    // Add custom Tab key handlers, tabindex does not work
    list = $('#image-selector-list').append(list).on('keydown', 'li', function(e) {
        if (e.which == 9) {
          if (rcube_event.get_modifier(e) == SHIFT_KEY) {
            if (!$(this).prev().focus().length) {
              button.focus();
            }
          }
          else if (!$(this).next().focus().length) {
            cancel.focus();
          }

          return false;
        }
      });

    button.keydown(function(e) {
      if (e.which == 9) { // Tab
        if (rcube_event.get_modifier(e) == SHIFT_KEY || !list.find('li').first().focus().length) {
          cancel.focus();
        }

        return false;
      }

      if (e.which == 13) { // Enter
        this.click();
      }
    });

    cancel.keydown(function(e) {
      if (e.which == 9) {
        if (rcube_event.get_modifier(e) != SHIFT_KEY || !list.find('li').last().focus().length) {
          button.focus();
        }

        return false;
      }
    });

    // enable drag-n-drop area
    if (window.FormData) {
      if (!rcmail.env.filedrop) {
        rcmail.env.filedrop = {};
      }
      if (rcmail.gui_objects.filedrop) {
        rcmail.env.old_file_drop = rcmail.gui_objects.filedrop;
      }

      rcmail.gui_objects.filedrop = $('#image-selector');
      rcmail.gui_objects.filedrop.addClass('droptarget')
        .on('dragover dragleave', function(e) {
          e.preventDefault();
          e.stopPropagation();
          $(this)[(e.type == 'dragover' ? 'addClass' : 'removeClass')]('hover');
        })
        .get(0).addEventListener('drop', function(e) { return rcmail.file_dropped(e); }, false);
    }

    // register handler for successful file upload
    if (!rcmail.env['file_dialog_event_' + type]) {
      rcmail.env['file_dialog_event+' + type] = true;
      rcmail.addEventListener('fileuploaded', function(attr) {
        var elem;
        if (elem = ref.file_picker_entry(attr.name, attr.attachment)) {
          list.prepend(elem);
          elem.focus();
        }
      });
    }

    // @todo: upload progress indicator
  };

  // close file browser window
  this.file_picker_close = function(url)
  {
    this.editor.windowManager.close();

    if (url)
      rcmail.env.file_picker_callback(url);

    if (rcmail.env.old_file_drop)
      rcmail.gui_objects.filedrop = rcmail.env.old_file_drop;
  };

  // creates file browser entry
  this.file_picker_entry = function(file_id, file)
  {
    if (!file.complete || !file.mimetype) {
      return;
    }

    if (rcmail.file_upload_id) {
      rcmail.set_busy(false, null, rcmail.file_upload_id);
    }

    var rx, img_src;

    switch (rcmail.env.file_picker_type) {
      case 'image':
        rx = /^image\//i;
        break;

      case 'media':
        rx = /^video\//i;
        img_src = rcmail.assets_path('program/resources/tinymce/video.png');
        break;

      default:
        return;
    }

    if (rx.test(file.mimetype)) {
      var path = rcmail.env.comm_path + '&_from=' + rcmail.env.action,
        action = rcmail.env.compose_id ? '&_id=' + rcmail.env.compose_id + '&_action=display-attachment' : '&_action=upload-display',
        href = path + action + '&_file=' + file_id,
        img = $('<img>').attr({title: file.name, src: img_src ? img_src : href + '&_thumbnail=1'});

      return $('<li>').attr({tabindex: 0})
        .data('url', href)
        .append($('<span class="img">').append(img))
        .append($('<span class="name">').text(file.name))
        .click(function() { ref.file_picker_close($(this).data('url')); })
        .keydown(function(e) {
          if (e.which == 13) {
            ref.file_picker_close($(this).data('url'));
          }
        });
    }
  };

  this.file_upload_form = function(clone_form)
  {
    var hint = clone_form ? $(clone_form).find('.hint').text() : '',
      form = $('<form id="imageuploadform">').attr({method: 'post', enctype: 'multipart/form-data'});
      file = $('<input>').attr({name: '_file[]', type: 'file', multiple: true, style: 'opacity:0;height:1px;width:1px'})
        .change(function() { rcmail.upload_file(form, 'upload'); }),
      wrapper = $('<div class="upload-form">')
        .append($('<button>').attr({'class': 'btn btn-secondary attach', href: '#', onclick: "rcmail.upload_input('imageuploadform')"}));

    if (hint)
      wrapper.prepend($('<div class="hint">').text(hint));

    // clone existing upload form
    if (clone_form) {
      file.attr('name', $('input[type="file"]', clone_form).attr('name'));
      form.attr('action', $(clone_form).attr('action'));
    }

    form.append(file).append($('<input>').attr({type: 'hidden', name: '_token', value: rcmail.env.request_token}));

    return wrapper.append(form);
  };
}

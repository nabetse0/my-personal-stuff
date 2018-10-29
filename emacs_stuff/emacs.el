(custom-set-variables
 ;; custom-set-variables was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 '(cua-mode t nil (cua-base))
 '(custom-enabled-themes (quote (deeper-blue)))
 '(ein:jupyter-default-notebook-directory "~/dev/projects/1um/DataAnalysis")
 '(ein:jupyter-default-server-command "~/AppData/Local/Continuum/Anaconda3/Scripts/jupyter.exe")
 '(hl-paren-colors (quote ("#fde725" "#5ec962" "#21918c" "#3b528b")))
 '(matlab-auto-fill t)
 '(matlab-comment-column 80)
 '(matlab-shell-command "matlab -nodesktop -nosplash")
 '(package-selected-packages
   (quote
    (markdown-mode evil-leader ag restclient htmlize ein
                   visible-mark unfill toml-mode racer
                   python-cell org matlab-mode
                   highlight-parentheses ivy glsl-mode
                   evil-surround evil-numbers evil-nerd-commenter
                   evil-magit ess ergoemacs-mode cython-mode
                   company cargo autopair auto-complete
                   ace-window ace-jump-mode)))
 '(projectile-project-root-files-bottom-up
   (quote
    (".git" ".hg" ".fslckout" ".bzr" "_darcs" ".projectile")))
 '(python-cell-highlight-face nil))

(custom-set-faces
 ;; custom-set-faces was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 '(default ((t (:family "Consolas" :foundry "outline" :slant normal :weight normal :height 98 :width normal)))))


;; Basic stuff
;;==============================================================================
;; Taken from http://cachestocaches.com/2015/8/getting-started-use-package/
;; Installs use-package in case it's not already installed.

(require 'package)
(setq package-enable-at-startup nil)
(add-to-list 'package-archives '("melpa" . "http://melpa.org/packages/"))
(add-to-list 'package-archives '("marmalade" . "http://marmalade-repo.org/packages/"))
(add-to-list 'package-archives '("gnu" . "http://elpa.gnu.org/packages/"))
(package-initialize)

(unless (package-installed-p 'use-package)
  (package-refresh-contents)
  (package-install 'use-package))

(eval-when-compile
  (require 'use-package))
(require 'diminish)
(require 'bind-key)


;; No startup screen
;;==============================================================================
(setq inhibit-startup-message t)


;; Use only spaces for aligning columns
;;==============================================================================
(setq-default indent-tabs-mode nil)


;; Reload buffer
;;==============================================================================
(defun reload-buffer ()
  (interactive)
  (revert-buffer t t t))

(global-set-key [f5] 'reload-buffer)


;; Duplicate line
;;==============================================================================
(defun duplicate-line ()
  (interactive)
  (move-beginning-of-line 1)
  (kill-line)
  (yank)
  (open-line 1)
  (next-line 1)
  (yank))
(global-set-key (kbd "M-d") 'duplicate-line)


;; C Settings
;;==============================================================================
(setq c-default-style "k&r"
      c-basic-offset 4)

(setq-default c-basic-offset 4)


;; TOML
;;==============================================================================

(use-package toml-mode
  :defer t)


;; evil-mode
;;==============================================================================

(defun my-insert-blank-line-above (&optional count)
  (interactive)
  (save-excursion
    (evil-open-above count)
    (evil-normal-state)))

(defun my-insert-blank-line-below (&optional count)
  (interactive)
  (save-excursion
    (evil-open-below count)
    (evil-normal-state)))

;; Narrow to region indirect
(defun narrow-to-region-indirect (start end)
  "Restrict editing in this buffer to the current region, indirectly."
  (interactive "r")
  (deactivate-mark)
  (let ((buf (clone-indirect-buffer nil nil)))
    (with-current-buffer buf
      (narrow-to-region start end))
      (switch-to-buffer buf)))

(use-package evil
  :ensure t
  :bind (:map evil-normal-state-map
         ("q" . nil)
         ("<f7>" . 'my-insert-blank-line-below)
         ("<f8>" . 'my-insert-blank-line-above)
         ("m" . narrow-to-region-indirect)
         :map evil-insert-state-map
         ("C-e" . nil)
         ("C-d" . nil)
         ("C-k" . nil)
         ("C-g" . 'evil-normal-state)
         ("C-;" . 'evil-normal-state)
         ("C-g" . 'evil-exit-visual-state)
         ("C-;" . 'evil-exit-visual-state)
         ("C-c" . 'evil-exit-visual-state)
         :map evil-motion-state-map
         ("C-e" . nil)
         :map evil-normal-state-map
         ([escape] . 'keyboard-quit)
         ("C-+" . 'evil-numbers/inc-at-pt)
         ("C-_" . 'evil-numbers/dec-at-pt)
         :map evil-visual-state-map
         ([escape] . 'keyboard-quit)
         ("m" . narrow-to-region-indirect)
         :map minibuffer-local-map 
         ([escape] . 'minibuffer-keyboard-quit) 
         :map minibuffer-local-ns-map 
         ([escape] . 'minibuffer-keyboard-quit) 
         :map minibuffer-local-completion-map 
         ([escape] . 'minibuffer-keyboard-quit) 
         :map minibuffer-local-must-match-map 
         ([escape] . 'minibuffer-keyboard-quit) 
         :map minibuffer-local-isearch-map 
         ([escape] . 'minibuffer-keyboard-quit))
  :config
  (evil-mode 1)

  (use-package evil-leader
    :ensure t
    :config
    (evil-leader/set-leader ",")
    (evil-leader/set-key
      "b" 'switch-to-buffer
      "w" 'save_buffer)
    (global-evil-leader-mode))

  (use-package evil-surround
    :ensure t
    :config
    (global-evil-surround-mode 1)
    (evil-embrace-enable-evil-surround-integration))

  (use-package evil-magit)

  (evilnc-default-hotkeys))



;; CUA mode
;;==============================================================================
(setq cua-enable-cua-keys nil) ;; don't include c-v, c-x, c-c, etc.
(cua-mode t)


;; Mark stuff
;;==============================================================================

; Faces for visible marks
(defface visible-mark-face1
  '((((class color) (min-colors 88) (background light))
     :background "gold1")
    (((class color) (min-colors 88) (background dark))
     :background "chocolate4")
    (((class color) (min-colors 16) (background light))
     :background "gold1")
    (((class color) (min-colors 16) (background dark))
     :background "DarkOrange")
    (((class color) (min-colors 8))
     :background "yellow" :foreground "black")
    (t :inverse-video t))
  "")

(defface visible-mark-face2
  '((((class color) (min-colors 88) (background light))
     :background "DarkOrange1")
    (((class color) (min-colors 88) (background dark))
     :background "burlywood4")
    (((class color) (min-colors 16) (background light))
     :background "DarkOrange1")
    (((class color) (min-colors 16) (background dark))
     :background "sienna")
    (((class color) (min-colors 8))
     :background "DarkMagenta" :foreground "black")
    (t :inverse-video t))
  "")

(defface visible-mark-face3
  '((((class color) (min-colors 88) (background light))
     :background "burlywood")
    (((class color) (min-colors 88) (background dark))
     :background "DimGray")
    (((class color) (min-colors 16) (background light))
     :background "burlywood")
    (((class color) (min-colors 16) (background dark))
     :background "firebrick")
    (((class color) (min-colors 8))
     :background "DarkRed" :foreground "black")
    (t :inverse-video t))
  "")

(use-package visible-mark
  :config 
  (setq visible-mark-faces (quote (visible-mark-face1 visible-mark-face2 visible-mark-face3)))
  ; Highlight last 3 marks
  (setq visible-mark-max 3)
  (global-visible-mark-mode))


;; markdown-mode
;;==============================================================================
(use-package markdown-mode
  :ensure t
  :commands (markdown-mode gfm-mode)
  :mode (("README\\.md\\'" . gfm-mode)
         ("\\.md\\'" . markdown-mode)
         ("\\.markdown\\'" . markdown-mode))
  :init (setq markdown-command "multimarkdown"))


;; auto-complete-mode
;;==============================================================================
(use-package auto-complete
  :config
  (use-package auto-complete-config)
  (ac-config-default))


;; electric-pair
;;==============================================================================
(electric-pair-mode 1)


;; Ivy
;;==============================================================================
(use-package ivy
  :init
  (ivy-mode 1)
  :demand
  :config
  (setq ivy-use-virtual-buffers t ivy-count-format "%d/%d "))


;; highlight parentheses
;;==============================================================================
(use-package highlight-parentheses
  :config
  (define-globalized-minor-mode global-highlight-parentheses-mode highlight-parentheses-mode
    (lambda ()
      (highlight-parentheses-mode t)))
  (global-highlight-parentheses-mode t))


;; reftex
;;==============================================================================
(use-package reftex
  :defer t
  :hook
  (LaTeX-mode . turn-on-reftex)
  :config
  (setq reftex-plug-into-AUCTeX t))


;; Org-mode
;;==============================================================================
(use-package org-install
  :mode ("\\.org$" . org-mode)
  :bind (("\C-cl" . org-store-link)
         ("\C-ca" . org-agenda))
  :config
  (setq org-log-done t)
  (setq org-CUA-compatible t))


;; Python
;;==============================================================================

(use-package python
  :mode ("\\.py\\'" . python-mode)
  :interpreter ("C:\\Users\\schang2\\AppData\\Local\\Continuum\\anaconda3\\python.exe" . python-mode)
  :bind (:map python-mode-map
         ("C-<" . python-indent-shift-left)
         ("C->" . python-indent-shift-right)))

(use-package cython-mode
  :mode (("\\.pyx\\'" . cython-mode)
         ("\\.pxd\\'" . cython-mode)
         ("\\.pxi\\'" . cython-mode)))



;; Matlab
;;==============================================================================

(use-package matlab-mode
  :mode ("\\m$" . matlab-mode)
  :config
  (setq matlab-indent-function t)
  (setq matlab-shell-command "matlab -nodesktop -nosplash"))


;; ace jump
;;==============================================================================

(use-package ace-jump-mode
  :bind (:map evil-normal-state-map
         ("SPC" . ace-jump-mode)))


(use-package ace-window-mode
  :bind ("M-o" . ace-window)
  :config
  (setq aw-keys '(?a ?s ?d ?f ?g ?h ?j ?k ?l)))


;; projectile
;;==============================================================================
(use-package projectile-mode
  :bind (:map projectile-command-map
         ("a" . helm-ag-project-root)
         ("s b" . helm-ag-buffers)))


;; Custom key bindings
;;==============================================================================

;; iedit fixes
(define-key global-map (kbd "C-c ;") 'iedit-mode)


;; unfill-paragraph
(defun unfill-paragraph (&optional region) 
  "Takes a multi-line paragraph and makes it into a single line of text."
  (interactive (progn (barf-if-buffer-read-only) '(t)))
  (let ((fill-column (point-max))
        (emacs-lisp-docstring-fill-column t))
    (fill-paragraph nil region)))

;; imenu
(global-set-key (kbd "M-i") 'imenu)
(put 'narrow-to-region 'disabled nil)

;; Magit
(global-set-key (kbd "C-x g") 'magit-status)


;; emacs server
;;==============================================================================
(server-start)
(put 'dired-find-alternate-file 'disabled nil)

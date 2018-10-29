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

(unless (package-installed-p 'diminish)
  (package-install 'diminish))
(eval-when-compile (require 'diminish))

(unless (package-installed-p 'bind-key)
  (package-install 'bind-key))
(eval-when-compile (require 'bind-key))

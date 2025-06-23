
	1.	Создать SSH ключ:

ssh-keygen -t ed25519 -C "front-deploy-key" -f ~/.ssh/front-deploy-key

	2.	Посмотреть публичный ключ (скопировать содержимое):

cat ~/.ssh/front-deploy-key.pub

	3.	Добавить публичный ключ в GitHub
 
	4.	Создать или отредактировать SSH конфиг:

nano ~/.ssh/config

Добавьте в файл:

Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/front-deploy-key
    IdentitiesOnly yes

Сохраните и закройте редактор.
	5.	Установить правильные права на ключи:

chmod 600 ~/.ssh/front-deploy-key
chmod 644 ~/.ssh/front-deploy-key.pub

	6.	Клонировать репозиторий:

git clone git@github.com:your-username/your-repo.git


Если SSH конфиг не настроен, можно клонировать так:

GIT_SSH_COMMAND="ssh -i ~/.ssh/front-deploy-key" git clone git@github.com:your-username/your-repo.git

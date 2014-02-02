git pull
export STATIC_ROOT="/var/www/tafareej/static/"
python manage.py collectstatic --noinput --clear
sudo /etc/init.d/httpd restart

# BACKEND:

### Tạo môi trường ảo

`py -m venv venv`

Chạy lỗi `Set-ExecutionPolicy Unrestricted -Scope Process`

`.\venv\Scripts\activate`

### Tải thư viện:

`pip install -r requirements.txt`

### Chạy backend: 

`py manage.py makemigrations`

`py manage.py migrate`

`py manage.py createsuperuser`

`py .\manage.py runserver`

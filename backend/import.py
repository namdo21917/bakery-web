import os
import django
import json
from datetime import datetime
# Thiết lập biến môi trường cho cài đặt Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'TLUfood.settings')  # Thay 'tiki' bằng tên dự án của bạn
django.setup()

from Web.models import Product, Category  # Thay 'api' bằng tên ứng dụng của bạn

# Đường dẫn đến file JSON
json_file_path = 'data.json'  # Đảm bảo đường dẫn đúng

# Đọc dữ liệu từ file JSON
with open(json_file_path, 'r', encoding='utf-8') as file:
    project_data = json.load(file)

def import_data_from_json(json_data):
    for item in json_data:
        # print(f"Processing item: {item}")  # Kiểm tra giá trị của item
        if 'category' in item:
            try:
                print(item['category'])
                category = Category.objects.get(name = item['category'])
            except:
                category = Category.objects.create(name = item['category'])
                category.save()
            

        try:
            id = item['id']
            name = item['name']
            image = item['image']
            price = item['price']
            description = item['description']
            status = item['status']
            
            product_data = { 'id' : id,
                        'name': name, 
                          'image': image, 
                          'price': price,
                          'description': description,
                          'status': status,
                          'category': category,
                          }
            
            # category_name = Category.objects.get(name=category)
            
            product, created = Product.objects.update_or_create(
                id = product_data['id'],
                defaults = product_data
            )
            print(product.name)
        except:
            print(f"Error: 'category' missing or not a dictionary in item {item}")
            continue  # Bỏ qua nếu thiếu category

# Gọi hàm để nhập dữ liệu từ file JSON
import_data_from_json(project_data)

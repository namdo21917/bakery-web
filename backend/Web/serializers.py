from rest_framework import serializers
from Web.models import *

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(max_length=50, write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            raise serializers.ValidationError('Email và mật khẩu là bắt buộc.')

        # Không cần tạo đối tượng User ở đây
        return data  # Trả về dữ liệu đã xác thực
    
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password', 'email']

    def create(self, validated_data):
        # Tạo người dùng mới với vai trò mặc định là 'customer'
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data['email'],
        )
        user.role = 'customer'  # Gán vai trò mặc định
        user.save()
        return user
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'phone_number', 'address']
    
class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'
        
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'
        
# class OrderSerializer(serializers.ModelSerializer):
#     products = ProductSerializer(many=True, read_only=True)

#     class Meta:
#         model = Order
#         fields = '__all__'

#     def create(self, validated_data):
#         # Lấy danh sách ID sản phẩn và xóa khỏi dữ liệu validated_data để tạo Order
#         product_data = validated_data.pop('products')

#         # Tạo Order trước
#         order = Order.objects.create(**validated_data)

#         # Duyệt qua danh sách ID sản phẩm để tạo OrderItem
#         for pro_item  in product_data:
#             pro_id = pro_item.get('id')
#             # Lấy đối tượng Producs từ ID
#             quantity = pro_item .get('quantity', 1)
#             try:
#                 product = Product.objects.get(id=pro_id)
#                 # thêm sách vào order = Order.objects.create(**validated_data) đã tạo trước đó
#                 order.products.add(product)

#             except Product.DoesNotExist:
#                 raise serializers.ValidationError(f"Sản phẩm với ID {pro_id} không tồn tại")

#             # Tạo OrderItem với số lượng mặc định là 1
#             OrderItem.objects.create(order=order, product=product, quantity=quantity)

#         return order
class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer()  # Serialize thông tin sản phẩm

    class Meta:
        model = OrderItem
        fields = ['product', 'quantity', 'total_value']

class OrderSerializer(serializers.ModelSerializer):
    products = OrderItemSerializer(source='orderitem_set', many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'tracking_number', 'status', 'created_at', 'updated_at',
                  'hovaten', 'sdt', 'email', 'diachi', 'tongtien', 'products']
        
class DiscountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Discount
        fields = '__all__'
        
class PaymentMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentMethod
        fields = '__all__'
        
class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer()  # Serialize thông tin sản phẩm
    class Meta:
        model = CartItem
        fields = '__all__'
        
class CartSerializer(serializers.ModelSerializer):
    products = OrderItemSerializer(source='cartitem_set', many=True, read_only=True)
    class Meta:
        model = Cart
        fields = '__all__'
        

import time
import random
import string


def generate_order_no() -> str:
    """生成订单号"""
    timestamp = int(time.time() * 1000)
    ts_str = format(timestamp, '036').upper()
    random_str = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    return f"ORD-{ts_str}-{random_str}"
